import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { deleteAccount, getCurrentProfile } from '../../actions/profile'
import Spinner from '../layout/Spinner'
import { DashboardActions } from './DashboardActions'
import Experience from './Experience'
import Education from './Education'

const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { profile, loading }, deleteAccount }) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile])
  console.log('profile:', profile);
  if (profile) {
    console.log('profile.experience:', profile.experience);
    console.log('profile.education:', profile.education);
  }
  const DeleteAccount = () => {
    return <div className="my-2" >
      <button className="btn btn-danger" onClick={() => {
        deleteAccount()
      }} >
        <i className="fas fa-user-minus" >
        </i>
        {' '}Delete My Account
    </button>
    </div>
  }
  return loading && profile === null ? <Spinner /> : <>
    <h1 className="large text-primary">
      Dashboard
    </h1>
    <p className="lead" >
      <i className="fas fa-user" >
        Welcome {user && user.name}
      </i>
    </p>
    {
      profile ? <>
        <DashboardActions />
        {
          (profile.experience.length) ? <Experience experience={profile.experience} /> : ''
        }
        {
          (profile.education.length) ? < Education education={profile.education} /> : ''
        }
        <DeleteAccount />

      </> : <> <p>
        You have not setup a profile, please add some info
      </p>
          <Link to='/create-profile' className="btn btn-primary my-1" >
            Create Profile
      </Link>
          <DeleteAccount />
        </>
    }
  </>
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)
