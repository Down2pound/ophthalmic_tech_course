package com.spindeleye.data.db

import android.content.Context
import androidx.room.Room
import com.spindeleye.data.api.LoginRequest
import com.spindeleye.data.api.SyncRequest
import com.spindeleye.data.api.SyncResponse
import kotlinx.coroutines.flow.Flow

/**
 * Repository pattern for data access
 * Coordinates between local Room database and remote API
 */
class EnrollmentRepository(
    private val enrollmentDao: EnrollmentDao,
    private val dayProgressDao: DayProgressDao,
    private val quizAttemptDao: QuizAttemptDao
) {

    /**
     * Get user's active enrollment with all progress data
     */
    fun getUserEnrollments(userId: String): Flow<List<com.spindeleye.data.model.Enrollment>> {
        return enrollmentDao.getUserEnrollments(userId)
    }

    /**
     * Get enrollment progress for all days
     */
    fun getEnrollmentProgress(enrollmentId: String): Flow<List<com.spindeleye.data.model.DayProgress>> {
        return dayProgressDao.getEnrollmentProgress(enrollmentId)
    }

    /**
     * Get completed days count
     */
    fun getCompletedDaysCount(enrollmentId: String): Flow<Int> {
        return dayProgressDao.getCompletedDaysCount(enrollmentId)
    }

    /**
     * Insert or update enrollment locally
     */
    suspend fun saveEnrollment(enrollment: com.spindeleye.data.model.Enrollment) {
        enrollmentDao.insert(enrollment)
    }

    /**
     * Update day progress
     */
    suspend fun updateDayProgress(dayProgress: com.spindeleye.data.model.DayProgress) {
        dayProgressDao.update(dayProgress)
    }

    companion object {
        @Volatile
        private var INSTANCE: EnrollmentRepository? = null

        fun getInstance(
            enrollmentDao: EnrollmentDao,
            dayProgressDao: DayProgressDao,
            quizAttemptDao: QuizAttemptDao
        ): EnrollmentRepository {
            return INSTANCE ?: synchronized(this) {
                EnrollmentRepository(
                    enrollmentDao,
                    dayProgressDao,
                    quizAttemptDao
                ).also { INSTANCE = it }
            }
        }
    }
}
