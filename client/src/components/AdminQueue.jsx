import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminQueue() {
  const [intakes, setIntakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    category: ''
  })
  const [sortConfig, setSortConfig] = useState({
    column: 'created_at',
    direction: 'desc' // 'asc' or 'desc'
  })
  const [auth, setAuth] = useState({
    password: '',
    authenticated: false
  })

  const navigate = useNavigate()

  useEffect(() => {
    // Check if already authenticated (stored in sessionStorage)
    const storedAuth = sessionStorage.getItem('adminAuth')
    const storedCredentials = sessionStorage.getItem('adminCredentials')
    if (storedAuth === 'true' && storedCredentials) {
      setAuth({ password: '', authenticated: true })
      fetchIntakes(storedCredentials)
    }
  }, [])

  const handleAuth = (e) => {
    e.preventDefault()
    const password = auth.password
    const credentials = btoa(`admin:${password}`)
    
    // Test auth by making a request
    fetch('/api/intakes', {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    })
      .then(res => {
        if (res.ok) {
          // Store credentials for subsequent requests
          sessionStorage.setItem('adminAuth', 'true')
          sessionStorage.setItem('adminCredentials', credentials)
          setAuth({ password: '', authenticated: true })
          fetchIntakes(credentials)
        } else {
          setError('Invalid password')
        }
      })
      .catch(err => {
        setError('Authentication failed')
      })
  }

  const fetchIntakes = (credentials = null, currentSortConfig = null) => {
    setLoading(true)
    setError(null)

    const headers = {}
    let authCredentials = credentials
    
    if (!authCredentials) {
      const storedCredentials = sessionStorage.getItem('adminCredentials')
      if (storedCredentials) {
        authCredentials = storedCredentials
      } else {
        setAuth({ password: '', authenticated: false })
        sessionStorage.removeItem('adminAuth')
        setLoading(false)
        return
      }
    }
    
    if (authCredentials) {
      headers['Authorization'] = `Basic ${authCredentials}`
    }

    let url = '/api/intakes'
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.category) params.append('category', filters.category)
    if (params.toString()) url += '?' + params.toString()

    fetch(url, { headers })
      .then(res => {
        if (res.status === 401) {
          setAuth({ password: '', authenticated: false })
          sessionStorage.removeItem('adminAuth')
          sessionStorage.removeItem('adminCredentials')
          throw new Error('Authentication required')
        }
        return res.json()
      })
      .then(data => {
        let sortedIntakes = [...(data.data || [])]
        
        // Use current sortConfig from state or passed parameter
        const sort = currentSortConfig !== null ? currentSortConfig : sortConfig
        
        // Sort by selected column
        sortedIntakes.sort((a, b) => {
          let aVal, bVal
          
          switch (sort.column) {
            case 'id':
              aVal = a.id
              bVal = b.id
              break
            case 'name':
              aVal = a.name.toLowerCase()
              bVal = b.name.toLowerCase()
              break
            case 'email':
              aVal = a.email.toLowerCase()
              bVal = b.email.toLowerCase()
              break
            case 'description':
              aVal = a.description.toLowerCase()
              bVal = b.description.toLowerCase()
              break
            case 'category':
              aVal = a.category
              bVal = b.category
              break
            case 'status':
              aVal = a.status
              bVal = b.status
              break
            case 'urgency':
              aVal = a.urgency
              bVal = b.urgency
              break
            case 'created_at':
            default:
              aVal = new Date(a.created_at)
              bVal = new Date(b.created_at)
              break
          }
          
          if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1
          if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1
          return 0
        })
        
        setIntakes(sortedIntakes)
      })
      .catch(err => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (auth.authenticated) {
      const storedCredentials = sessionStorage.getItem('adminCredentials')
      fetchIntakes(storedCredentials, sortConfig)
    }
  }, [filters.status, filters.category, sortConfig])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
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

  const handleSort = (column) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getSortIndicator = (column) => {
    if (sortConfig.column !== column) {
      return <span style={{ marginLeft: '5px', color: '#999' }}>↕</span>
    }
    return sortConfig.direction === 'asc' 
      ? <span style={{ marginLeft: '5px' }}>↑</span>
      : <span style={{ marginLeft: '5px' }}>↓</span>
  }

  if (!auth.authenticated) {
    return (
      <div className="card">
        <h2>Admin Login</h2>
        <form onSubmit={handleAuth}>
          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              value={auth.password}
              onChange={(e) => setAuth({ ...auth, password: e.target.value })}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    )
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    sessionStorage.removeItem('adminCredentials')
    setAuth({ password: '', authenticated: false })
    setIntakes([])
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Admin Queue</h2>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
        
        <div className="filter-group">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="billing">Billing</option>
            <option value="technical_support">Technical Support</option>
            <option value="new_matter_project">New Matter/Project</option>
            <option value="other">Other</option>
          </select>

        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th 
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('id')}
                >
                  ID{getSortIndicator('id')}
                </th>
                <th 
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('name')}
                >
                  Name{getSortIndicator('name')}
                </th>
                <th 
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('email')}
                >
                  Email{getSortIndicator('email')}
                </th>
                <th 
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('description')}
                >
                  Description{getSortIndicator('description')}
                </th>
                <th 
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('category')}
                >
                  Category{getSortIndicator('category')}
                </th>
                <th 
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('status')}
                >
                  Status{getSortIndicator('status')}
                </th>
                <th 
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('urgency')}
                >
                  Urgency{getSortIndicator('urgency')}
                </th>
                <th 
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('created_at')}
                >
                  Created{getSortIndicator('created_at')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {intakes.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                    No intakes found
                  </td>
                </tr>
              ) : (
                intakes.map(intake => (
                  <tr key={intake.id}>
                    <td>{intake.id}</td>
                    <td>{intake.name}</td>
                    <td>{intake.email}</td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {intake.description}
                    </td>
                    <td>{getCategoryBadge(intake.category)}</td>
                    <td>{getStatusBadge(intake.status)}</td>
                    <td>
                      <span className={`urgency urgency-${intake.urgency}`}>
                        {intake.urgency}
                      </span>
                    </td>
                    <td>{formatDate(intake.created_at)}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/admin/intakes/${intake.id}`)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminQueue

