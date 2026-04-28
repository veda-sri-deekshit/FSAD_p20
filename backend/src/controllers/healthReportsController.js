import { db } from '../database.js';

// Generate Health Report
export const generateHealthReport = (req, res) => {
  try {
    const { patientEmail, reportType, description, reportDate } = req.body;

    if (!patientEmail || !reportType) {
      return res.status(400).json({
        success: false,
        error: 'Patient email and report type are required'
      });
    }

    const user = db.findUserByEmail(patientEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Generate new health report
    const newReport = db.addHealthReport({
      patientEmail,
      reportType, // 'lab', 'medical', 'wellness', 'diagnosis', 'prescription_summary'
      title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      description: description || '',
      reportDate: reportDate || new Date().toISOString().split('T')[0],
      generatedAt: new Date(),
      status: 'completed'
    });

    console.log(`✅ Health report generated: ${reportType} for ${patientEmail}`);

    res.status(201).json({
      success: true,
      message: 'Health report generated successfully',
      data: newReport
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate health report'
    });
  }
};

// Get All Health Reports for a User
export const getUserHealthReports = (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const user = db.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const reports = db.getHealthReportsByUser(email);

    console.log(`✅ Retrieved ${reports.length} health reports for: ${email}`);

    res.json({
      success: true,
      data: {
        email,
        totalReports: reports.length,
        reports: reports.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))
      }
    });
  } catch (error) {
    console.error('Get health reports error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch health reports'
    });
  }
};

// Get Specific Health Report
export const getHealthReportById = (req, res) => {
  try {
    const { reportId } = req.params;
    const { email } = req.query;

    if (!reportId || !email) {
      return res.status(400).json({
        success: false,
        error: 'Report ID and email are required'
      });
    }

    const report = db.getHealthReportById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // Verify ownership
    if (report.patientEmail !== email) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access to this report'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch health report'
    });
  }
};

// Get Reports by Type
export const getReportsByType = (req, res) => {
  try {
    const { email, type } = req.query;

    if (!email || !type) {
      return res.status(400).json({
        success: false,
        error: 'Email and report type are required'
      });
    }

    const user = db.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const reports = db.getHealthReportsByType(email, type);

    console.log(`✅ Retrieved ${reports.length} ${type} reports for: ${email}`);

    res.json({
      success: true,
      data: {
        email,
        reportType: type,
        totalReports: reports.length,
        reports: reports.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))
      }
    });
  } catch (error) {
    console.error('Get reports by type error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports'
    });
  }
};

// Update Health Report
export const updateHealthReport = (req, res) => {
  try {
    const { reportId } = req.params;
    const { email, description, status } = req.body;

    if (!reportId || !email) {
      return res.status(400).json({
        success: false,
        error: 'Report ID and email are required'
      });
    }

    const report = db.getHealthReportById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // Verify ownership
    if (report.patientEmail !== email) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access to this report'
      });
    }

    const updatedReport = db.updateHealthReport(reportId, {
      description: description || report.description,
      status: status || report.status,
      updatedAt: new Date()
    });

    console.log(`✅ Health report updated: ${reportId}`);

    res.json({
      success: true,
      message: 'Health report updated successfully',
      data: updatedReport
    });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update health report'
    });
  }
};

// Delete Health Report
export const deleteHealthReport = (req, res) => {
  try {
    const { reportId } = req.params;
    const { email } = req.query;

    if (!reportId || !email) {
      return res.status(400).json({
        success: false,
        error: 'Report ID and email are required'
      });
    }

    const report = db.getHealthReportById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // Verify ownership
    if (report.patientEmail !== email) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access to this report'
      });
    }

    db.deleteHealthReport(reportId);

    console.log(`✅ Health report deleted: ${reportId}`);

    res.json({
      success: true,
      message: 'Health report deleted successfully'
    });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete health report'
    });
  }
};

// Get Health Report Summary
export const getHealthReportSummary = (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const user = db.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const summary = db.getHealthReportSummary(email);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Get report summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch report summary'
    });
  }
};
