
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { addEducation } from '../../actions/profile'

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: '',
  })

  const [toDateDisabled, toggleDisabled] = useState(false)
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })
  console.log('...formData', formData);
  useEffect(() => {
      console.log('toDateDisabled', formData);
      setFormData({ ...formData, to: '', });
  }, [toDateDisabled]);

  return (
    <>
      <h1 class="large text-primary">
        Add Your Education
      </h1>
      <p class="lead">
        <i class="fas fa-code-branch"></i> Add any school or boot camp that you have attended
      </p>
      <small>* is required field</small>
      <form class="form" onSubmit={e => {
        e.preventDefault();
        addEducation(formData, history)
      }} >
        <div class="form-group">
          <input type="text" placeholder="* School or boot camp" name="school" value={school} onChange={onChange} />
        </div>
        <div class="form-group">
          <input type="text" placeholder="* Degree or Certificate" name="degree" value={degree} onChange={onChange} />
        </div>
        <div class="form-group">
          <input type="text" placeholder="* Field of study" name="fieldofstudy" value={fieldofstudy} onChange={onChange} />
        </div>
        <div class="form-group">
          <h4>* From Date</h4>
          <input type="date" name="from" value={from} onChange={onChange} />
        </div>
        <div class="form-group">
          <p><input type="checkbox" name="current" value="" value={current} onChange={e => {
            setFormData({ ...formData, current: !current });
            toggleDisabled(!toDateDisabled);
          }
          } /> {' '} Current School</p>
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
            placeholder="Program Description"
            value={description} onChange={onChange}
          ></textarea>
        </div>
        <input type="submit" class="btn btn-primary my-1" />
        <Link to='/dashboard'>
          <a class="btn btn-light my-1" >Go Back</a>
        </Link>
      </form>
    </>
  )
}

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({

})


export default connect(null, { addEducation })(AddEducation)
