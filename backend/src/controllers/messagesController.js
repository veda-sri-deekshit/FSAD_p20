// Messages Controller
import { db } from '../database.js';

// Initialize messages array if not exists
if (!db.messages) {
  db.messages = [];
}

// Send a message
export const sendMessage = (req, res) => {
  try {
    const { fromEmail, toEmail, subject, message, appointmentId } = req.body;

    if (!fromEmail || !toEmail || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fromEmail, toEmail, message',
      });
    }

    const newMessage = {
      id: (db.messages?.length || 0) + 1,
      fromEmail,
      toEmail,
      subject: subject || 'No subject',
      message,
      appointmentId: appointmentId || null,
      timestamp: new Date(),
      isRead: false,
      type: 'appointment-related', // Could be 'appointment-related', 'general', etc.
    };

    if (!db.messages) {
      db.messages = [];
    }

    db.messages.push(newMessage);

    console.log(`✅ Message sent from ${fromEmail} to ${toEmail}`);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get messages for a user
export const getMessages = (req, res) => {
  try {
    const { email } = req.query;
    const { unreadOnly } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'email query parameter is required',
      });
    }

    let messages = (db.messages || []).filter(msg => msg.toEmail === email);

    if (unreadOnly === 'true') {
      messages = messages.filter(msg => !msg.isRead);
    }

    // Sort by newest first
    messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get conversation between two users
export const getConversation = (req, res) => {
  try {
    const { email1, email2 } = req.query;

    if (!email1 || !email2) {
      return res.status(400).json({
        success: false,
        error: 'email1 and email2 parameters are required',
      });
    }

    const conversation = (db.messages || [])
      .filter(msg => 
        (msg.fromEmail === email1 && msg.toEmail === email2) ||
        (msg.fromEmail === email2 && msg.toEmail === email1)
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Mark message as read
export const markMessageAsRead = (req, res) => {
  try {
    const { messageId } = req.params;

    const message = (db.messages || []).find(m => m.id === parseInt(messageId));

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    message.isRead = true;

    res.json({
      success: true,
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get unread message count
export const getUnreadCount = (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'email query parameter is required',
      });
    }

    const unreadCount = (db.messages || []).filter(msg => 
      msg.toEmail === email && !msg.isRead
    ).length;

    res.json({
      success: true,
      data: { unreadCount, email },
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
