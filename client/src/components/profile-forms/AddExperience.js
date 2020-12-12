import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addExperience } from '../../actions/profile'

const AddExperience = props => {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: '',
  })

  const [toDateDisabled, toggleDisabled] = useState(false)
  const {
    company,
    title,
    location,
    from,
    to,
    current,
    description,
  } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  return (
    <>
      <h1 class="large text-primary">
        Add An Experience
      </h1>
      <p class="lead">
        <i class="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* is required field</small>
      <form class="form">
        <div class="form-group">
          <input type="text" placeholder="* Job Title" name="title" required value={title} onChange={onChange} />
        </div>
        <div class="form-group">
          <input type="text" placeholder="* Company" name="company" required value={company} onChange={onChange} />
        </div>
        <div class="form-group">
          <input type="text" placeholder="Location" name="location" value={location} onChange={onChange} />
        </div>
        <div class="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={onChange} />
        </div>
        <div class="form-group">
          <p><input type="checkbox" name="current" value="" value={current} onChange={e => {
            setFormData({ ...formData, current: !current })
            toggleDisabled(!toDateDisabled)
          }
          } /> {' '} Current Job</p>
        </div>
        <div class="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange={onChange} disabled={toDateDisabled} />
        </div>
        <div class="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Job Description"
            value={description} onChange={onChange}
          ></textarea>
        </div>
        <input type="submit" class="btn btn-primary my-1" />
        <a class="btn btn-light my-1" href="dashboard.html">Go Back</a>
      </form>
    </>
  )
}

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({

})


export default connect(null, { addExperience })(AddExperience)
