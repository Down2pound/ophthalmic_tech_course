package com.spindeleye.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.spindeleye.data.db.EnrollmentDao
import com.spindeleye.data.model.Enrollment
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * ViewModel managing course state, enrollment data, and progress tracking
 * Coordinates between local Room database and backend API
 */
class OptogeekViewModel(
    private val enrollmentDao: EnrollmentDao
) : ViewModel() {

    private val _enrollmentState = MutableStateFlow<EnrollmentUiState>(EnrollmentUiState.Loading)
    val enrollmentState: StateFlow<EnrollmentUiState> = _enrollmentState.asStateFlow()

    private val _currentDayState = MutableStateFlow(1)
    val currentDayState: StateFlow<Int> = _currentDayState.asStateFlow()

    private val _adminMode = MutableStateFlow(false)
    val adminMode: StateFlow<Boolean> = _adminMode.asStateFlow()

    /**
     * Initialize ViewModel with user's active enrollment
     */
    fun initializeUserEnrollment(userId: String) {
        viewModelScope.launch {
            try {
                _enrollmentState.value = EnrollmentUiState.Loading
                val enrollment = enrollmentDao.getActiveEnrollment(userId)
                
                if (enrollment != null) {
                    _enrollmentState.value = EnrollmentUiState.Success(enrollment)
                    _currentDayState.value = enrollment.currentDay
                } else {
                    _enrollmentState.value = EnrollmentUiState.NoEnrollment
                }
            } catch (e: Exception) {
                _enrollmentState.value = EnrollmentUiState.Error(e.message ?: "Unknown error")
            }
        }
    }

    /**
     * Advance to next day if prerequisites met
     */
    fun advanceToNextDay() {
        viewModelScope.launch {
            if (_currentDayState.value < 10) {
                _currentDayState.value += 1
            }
        }
    }

    /**
     * Toggle admin mode with admin credentials
     */
    fun toggleAdminMode(isAdmin: Boolean) {
        _adminMode.value = isAdmin
    }

    /**
     * Bypass course locks for testing (admin only)
     */
    fun bypassCourseLocks() {
        if (_adminMode.value) {
            // TODO: Implement bypass logic
        }
    }

    /**
     * Bulk complete all curriculum days (admin only)
     */
    fun bulkCompleteCurriculum() {
        if (_adminMode.value) {
            viewModelScope.launch {
                // TODO: Implement bulk completion logic
            }
        }
    }
}

sealed class EnrollmentUiState {
    object Loading : EnrollmentUiState()
    object NoEnrollment : EnrollmentUiState()
    data class Success(val enrollment: Enrollment) : EnrollmentUiState()
    data class Error(val message: String) : EnrollmentUiState()
}
