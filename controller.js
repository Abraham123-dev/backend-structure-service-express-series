//writing a controllr that will handle the logic for the application

//student sends post requst to /api/message with a body like this:

//{ "message": "Hello BRAUDLE" }


const express = require('express');
const { logger, timer } = require('./middleware');
const { basicRateLimiter } = require('./rateLimiter');

function handleStudentMessage(req, res) {
    const { message } = req.body;

    // Validate input
    if (!message) {
        return res.status(400).json({
            error: 'Message is required'
        });
    }

    try {
        // Business Logic: Process student message
        const processedMessage = processStudentMessage(message);
        
        // Business Logic: Generate response
        const response = generateResponse(processedMessage);
        
        // Business Logic: Store message record
        const record = storeMessageRecord(message, response);
        
        // Return success response
        return res.status(200).json({
            success: true,
            message: message,
            response: response,
            recordId: record.id,
            timestamp: record.timestamp
        });
    } catch (error) {
        logger.error(`Error processing message: ${error.message}`);
        return res.status(500).json({
            error: 'Failed to process message'
        });
    }
}

function processStudentMessage(message) {
    // Clean and normalize the message
    const processed = message.trim().toLowerCase();
    
    // Extract keywords or entities if needed
    const keywords = processed.split(' ');
    
    return {
        original: message,
        processed: processed,
        keywords: keywords,
        length: message.length
    };
}

function generateResponse(processedMessage) {
    // Generate intelligent response based on processed message
    const { processed, keywords } = processedMessage;
    
    if (keywords.includes('hello')) {
        return 'Hello! How can I help you today?';
    } else if (keywords.includes('help')) {
        return 'I\'m here to assist. Please provide more details.';
    } else {
        return `I received your message: "${processedMessage.original}". Please continue.`;
    }
}

function storeMessageRecord(message, response) {
    // Store message record (in-memory for now, can be replaced with DB)
    const record = {
        id: Math.random().toString(36).substr(2, 9),
        message: message,
        response: response,
        timestamp: new Date().toISOString()
    };
    
    // Log for audit trail
    logger.info(`Message stored - ID: ${record.id}, Time: ${record.timestamp}`);
    
    return record;
}

module.exports = {
    handleStudentMessage,
    processStudentMessage,
    generateResponse,
    storeMessageRecord
};
