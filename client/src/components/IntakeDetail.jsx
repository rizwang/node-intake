import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function IntakeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [intake, setIntake] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [updateData, setUpdateData] = useState({
    status: '',
    internal_notes: ''
  })

  useEffect(() => {
    fetchIntake()
  }, [id])

  const fetchIntake = () => {
    setLoading(true)
    setError(null)

    // Get credentials from sessionStorage
    const storedCredentials = sessionStorage.getItem('adminCredentials')
    if (!storedCredentials) {
      setError('Authentication required. Please login from the admin queue.')
      setLoading(false)
      setTimeout(() => navigate('/admin'), 2000)
      return
    }

    fetch(`/api/intakes/${id}`, {
      headers: {
        'Authorization': `Basic ${storedCredentials}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          sessionStorage.removeItem('adminAuth')
          sessionStorage.removeItem('adminCredentials')
          throw new Error('Authentication required. Please login again.')
        }
        if (!res.ok) {
          throw new Error('Failed to fetch intake')
        }
        return res.json()
      })
      .then(data => {
        setIntake(data.data)
        setUpdateData({
          status: data.data.status,
          internal_notes: data.data.internal_notes || ''
        })
      })
      .catch(err => {
        setError(err.message)
        if (err.message.includes('Authentication')) {
          setTimeout(() => navigate('/admin'), 2000)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setError(null)

    const storedCredentials = sessionStorage.getItem('adminCredentials')
    if (!storedCredentials) {
      setError('Authentication required. Please login from the admin queue.')
      setUpdating(false)
      setTimeout(() => navigate('/admin'), 2000)
      return
    }

    try {
      const response = await fetch(`/api/intakes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${storedCredentials}`
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (response.status === 401) {
        sessionStorage.removeItem('adminAuth')
        sessionStorage.removeItem('adminCredentials')
        throw new Error('Authentication required. Please login again.')
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update intake')
      }

      setIntake(data.data)
      alert('Intake updated successfully!')
    } catch (err) {
      setError(err.message)
      if (err.message.includes('Authentication')) {
        setTimeout(() => navigate('/admin'), 2000)
      }
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status}`}>{status.replace('_', ' ')}</span>
  }

  const getCategoryBadge = (category) => {
    return <span className={`badge badge-${category}`}>{category.replace('_', ' ')}</span>
  }

  if (loading) {
    return <div className="card">Loading...</div>
  }

  if (error || !intake) {
    return (
      <div className="card">
        <div className="error">{error || 'Intake not found'}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
          Back to Queue
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="card">
        <h2>Intake Details #{intake.id}</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/admin')}
          style={{ marginBottom: '20px' }}
        >
          ← Back to Queue
        </button>

        <div style={{ marginBottom: '30px' }}>
          <h3>Request Information</h3>
          <table className="table" style={{ marginTop: '10px' }}>
            <tbody>
              <tr>
                <td style={{ fontWeight: '600', width: '200px' }}>Name</td>
                <td>{intake.name}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Email</td>
                <td>{intake.email}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Description</td>
                <td>{intake.description}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Urgency</td>
                <td>
                  <span className={`urgency urgency-${intake.urgency}`}>
                    {intake.urgency}
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Category</td>
                <td>{getCategoryBadge(intake.category)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Status</td>
                <td>{getStatusBadge(intake.status)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Created At</td>
                <td>{formatDate(intake.created_at)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600' }}>Updated At</td>
                <td>{formatDate(intake.updated_at)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3>Update Intake</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={updateData.status}
                onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                required
              >
                <option value="new">New</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="internal_notes">Internal Notes</label>
              <textarea
                id="internal_notes"
                name="internal_notes"
                value={updateData.internal_notes}
                onChange={(e) => setUpdateData({ ...updateData, internal_notes: e.target.value })}
                placeholder="Add internal notes..."
                rows="5"
              />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? 'Updating...' : 'Update Intake'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default IntakeDetail

