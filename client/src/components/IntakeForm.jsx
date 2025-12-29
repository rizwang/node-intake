import React, { useState } from 'react'

function IntakeForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    urgency: 3
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'urgency' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/intakes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit intake')
      }

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        description: '',
        urgency: 3
      })

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Submit Intake Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Please describe your request..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="urgency">Urgency (1-5) *</label>
          <select
            id="urgency"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            required
          >
            <option value={1}>1 - Low</option>
            <option value={2}>2 - Medium-Low</option>
            <option value={3}>3 - Medium</option>
            <option value={4}>4 - Medium-High</option>
            <option value={5}>5 - High</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}
        {success && (
          <div className="success">
            Intake submitted successfully! It has been classified and added to the queue.
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Intake'}
        </button>
      </form>
    </div>
  )
}

export default IntakeForm

