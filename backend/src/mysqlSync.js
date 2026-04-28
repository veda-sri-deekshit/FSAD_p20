import { pool } from './mysql.js';

export const syncMysql = {
    insertUser(user) {
        pool.query('INSERT INTO users (id, email, password, role, registeredAt, stats) VALUES (?, ?, ?, ?, ?, ?)',
            [user.id, user.email, user.password, user.role, user.registeredAt, JSON.stringify(user.stats)]).catch(e=>console.error("MySQL Sync Error (insertUser):", e));
    },
    updateUser(email, user) {
        pool.query('UPDATE users SET password=?, stats=?, resetOTP=?, resetOTPExpiry=? WHERE email=?',
            [user.password, JSON.stringify(user.stats || {}), user.resetOTP, user.resetOTPExpiry, email]).catch(e=>console.error("MySQL Sync Error (updateUser):", e));
    },
    insertAppointment(appt) {
        pool.query('INSERT INTO appointments (id, patientEmail, doctorId, date, time, symptoms, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [appt.id, appt.patientEmail, appt.doctorId, appt.date, appt.time, appt.symptoms, appt.status, appt.createdAt]).catch(e=>console.error("MySQL Sync Error (insertAppointment):", e));
    },
    updateAppointmentStatus(id, status, updatedAt) {
        pool.query('UPDATE appointments SET status=?, updatedAt=? WHERE id=?', [status, updatedAt, id]).catch(e=>console.error("MySQL Sync Error (updateAppointmentStatus):", e));
    },
    insertHealthRecord(record) {
        // Attempt update first, if no rows updated, insert
        pool.query('UPDATE health_records SET medicalInfo=?, updatedAt=? WHERE patientEmail=?', 
            [JSON.stringify(record.medicalInfo), record.updatedAt || new Date(), record.patientEmail]
        ).then(async ([result]) => {
            if (result.affectedRows === 0) {
                await pool.query('INSERT INTO health_records (patientEmail, medicalInfo, createdAt) VALUES (?, ?, ?)',
                    [record.patientEmail, JSON.stringify(record.medicalInfo), record.createdAt || new Date()]);
            }
        }).catch(e=>console.error("MySQL Sync Error (insertHealthRecord):", e));
    },
    insertPrescription(rx) {
        pool.query('INSERT INTO prescriptions (id, patientEmail, medicationName, dosage, frequency, duration, refillsRemaining, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [rx.id, rx.patientEmail, rx.medicationName, rx.dosage, rx.frequency, rx.duration, rx.refillsRemaining, rx.createdAt]).catch(e=>console.error("MySQL Sync Error (insertPrescription):", e));
    },
    insertLabReport(lab) {
        pool.query('INSERT INTO lab_reports (id, patientEmail, testName, result, laboratoryName, date, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [lab.id, lab.patientEmail, lab.testName, lab.result, lab.laboratoryName, lab.date, lab.createdAt]).catch(e=>console.error("MySQL Sync Error (insertLabReport):", e));
    }
}

export const initTablesAndSync = async (dbMemory) => {
    try {
        console.log('⏳ Initializing MySQL Tables...');
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY, email VARCHAR(100), password VARCHAR(100), role VARCHAR(50), 
            registeredAt DATETIME, stats JSON, resetToken VARCHAR(255), resetTokenExpiry DATETIME,
            resetOTP VARCHAR(10), resetOTPExpiry DATETIME, isActive BOOLEAN
        )`);
        
        await pool.query(`CREATE TABLE IF NOT EXISTS doctors (
            id INT PRIMARY KEY, name VARCHAR(100), specialty VARCHAR(100), availableSlots JSON, isAvailable BOOLEAN
        )`);
        
        await pool.query(`CREATE TABLE IF NOT EXISTS appointments (
            id INT PRIMARY KEY, patientEmail VARCHAR(100), doctorId INT, date VARCHAR(50), time VARCHAR(50),
            symptoms TEXT, status VARCHAR(50), createdAt DATETIME, updatedAt DATETIME
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS health_records (
            patientEmail VARCHAR(100) PRIMARY KEY, medicalInfo JSON, createdAt DATETIME, updatedAt DATETIME
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS prescriptions (
            id INT PRIMARY KEY, patientEmail VARCHAR(100), medicationName VARCHAR(100), dosage VARCHAR(50), frequency VARCHAR(50), duration VARCHAR(50), refillsRemaining INT, createdAt DATETIME
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS lab_reports (
            id INT PRIMARY KEY, patientEmail VARCHAR(100), testName VARCHAR(100), result VARCHAR(255), laboratoryName VARCHAR(100), date VARCHAR(50), createdAt DATETIME
        )`);

        console.log('✅ Tables Created');

        // Load Users
        const [usersRows] = await pool.query('SELECT * FROM users');
        if (usersRows.length > 0) {
            dbMemory.users.length = 0;
            usersRows.forEach(row => dbMemory.users.push({...row, stats: row.stats || {}}));
        }

        // Load Doctors
        const [doctorsRows] = await pool.query('SELECT * FROM doctors');
        if (doctorsRows.length === 0) {
            for (let doc of dbMemory.doctors) {
                await pool.query('INSERT INTO doctors (id, name, specialty, availableSlots, isAvailable) VALUES (?, ?, ?, ?, ?)', [doc.id, doc.name, doc.specialty, JSON.stringify(doc.availableSlots), doc.isAvailable]);
            }
        } else {
            dbMemory.doctors.length = 0;
            doctorsRows.forEach(row => dbMemory.doctors.push({...row, availableSlots: typeof row.availableSlots === 'string' ? JSON.parse(row.availableSlots) : row.availableSlots}));
        }

        // Load Appointments
        const [apptsRows] = await pool.query('SELECT * FROM appointments');
        if (apptsRows.length > 0) {
            dbMemory.appointments.length = 0;
            apptsRows.forEach(row => dbMemory.appointments.push(row));
        }

        // Load Health Records
        const [recordsRows] = await pool.query('SELECT * FROM health_records');
        if (recordsRows.length > 0) {
            dbMemory.healthRecords.length = 0;
            dbMemory.healthRecords.push(...recordsRows.map(r => ({...r, medicalInfo: typeof r.medicalInfo === 'string' ? JSON.parse(r.medicalInfo) : (r.medicalInfo || {}) })));
        }

        // Load Prescriptions
        const [rxRows] = await pool.query('SELECT * FROM prescriptions');
        if (rxRows.length > 0) {
            dbMemory.prescriptions.length = 0;
            dbMemory.prescriptions.push(...rxRows);
        }

        // Load Lab Reports
        const [labRows] = await pool.query('SELECT * FROM lab_reports');
        if (labRows.length > 0) {
             dbMemory.labReports.length = 0;
             dbMemory.labReports.push(...labRows);
        }
        
        // Relink prescriptions into healthRecords for memory structure
        dbMemory.healthRecords.forEach(hr => {
            hr.prescriptions = dbMemory.prescriptions.filter(p => p.patientEmail === hr.patientEmail);
            hr.vaccinations = hr.vaccinations || [];
            hr.allergies = hr.allergies || [];
        });

        console.log('✅ Memory Arrays Populated from MySQL');
    } catch (e) {
        console.error('❌ MySQL Sync Error on init:', e);
    }
}
