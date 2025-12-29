/**
 * Input Validation Middleware
 */

export function validateCreateIntake(req, res, next) {
  const { name, email, description, urgency } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required and must be a non-empty string');
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('email is required and must be a non-empty string');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('email must be a valid email address');
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('description is required and must be a non-empty string');
  }

  if (urgency === undefined || urgency === null) {
    errors.push('urgency is required');
  } else if (!Number.isInteger(Number(urgency)) || Number(urgency) < 1 || Number(urgency) > 5) {
    errors.push('urgency must be an integer between 1 and 5');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input',
      errors
    });
  }

  next();
}

export function validateUpdateIntake(req, res, next) {
  const { status, internal_notes } = req.body;
  const errors = [];

  if (status !== undefined) {
    const validStatuses = ['new', 'in_review', 'resolved'];
    if (!validStatuses.includes(status)) {
      errors.push(`status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  if (internal_notes !== undefined && typeof internal_notes !== 'string') {
    errors.push('internal_notes must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input',
      errors
    });
  }

  next();
}

