import express from 'express';
import db from '../database.js';
import { classifyIntake } from '../classifier.js';
import { requireAuth } from '../middleware/auth.js';
import { validateCreateIntake, validateUpdateIntake } from '../middleware/validation.js';

const router = express.Router();

// POST /api/intakes - Create new intake (public)
router.post('/', validateCreateIntake, (req, res) => {
  try {
    const { name, email, description, urgency } = req.body;

    // Classify the intake using heuristics
    const category = classifyIntake(description);

    const stmt = db.prepare(`
      INSERT INTO intakes (name, email, description, urgency, category, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `);

    const result = stmt.run(name.trim(), email.trim(), description.trim(), urgency, category);

    const intake = db.prepare('SELECT * FROM intakes WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      message: 'Intake created successfully',
      data: intake
    });
  } catch (error) {
    console.error('Error creating intake:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create intake'
    });
  }
});

// GET /api/intakes - List intakes (protected)
router.get('/', requireAuth, (req, res) => {
  try {
    const { status, category } = req.query;

    let query = 'SELECT * FROM intakes WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const intakes = stmt.all(...params);

    res.json({
      message: 'Intakes retrieved successfully',
      data: intakes,
      count: intakes.length
    });
  } catch (error) {
    console.error('Error fetching intakes:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch intakes'
    });
  }
});

// GET /api/intakes/:id - Get single intake (protected)
router.get('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;

    const intake = db.prepare('SELECT * FROM intakes WHERE id = ?').get(id);

    if (!intake) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Intake not found'
      });
    }

    res.json({
      message: 'Intake retrieved successfully',
      data: intake
    });
  } catch (error) {
    console.error('Error fetching intake:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch intake'
    });
  }
});

// PATCH /api/intakes/:id - Update intake (protected)
router.patch('/:id', requireAuth, validateUpdateIntake, (req, res) => {
  try {
    const { id } = req.params;
    const { status, internal_notes } = req.body;

    // Check if intake exists
    const existing = db.prepare('SELECT * FROM intakes WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Intake not found'
      });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }

    if (internal_notes !== undefined) {
      updates.push('internal_notes = ?');
      params.push(internal_notes);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'No fields to update'
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE intakes SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...params);

    const updated = db.prepare('SELECT * FROM intakes WHERE id = ?').get(id);

    res.json({
      message: 'Intake updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating intake:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update intake'
    });
  }
});

export default router;

