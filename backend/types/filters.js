/**
 * @typedef {Object} FilterOption
 * @property {string} field - Field name
 * @property {string} label - Display label
 * @property {string[]} options - Available options
 */

/** @type {FilterOption[]} */
const TUTOR_FILTERS = [
  {
    field: 'student_gender',
    label: 'Student gender',
    options: ['Male', 'Female']
  },
  {
    field: 'teaching_type',
    label: 'Teaching type',
    options: ['One-to-one', 'One-to-many']
  },
  {
    field: 'student_grade',
    label: 'Student grade',
    options: ['Kindergarten', 'Primary school', 'Junior high school', 'Middle school', 'Senior high school', 'Freshman', 'Sophomore', 'Junior', 'Other']
  },
  {
    field: 'subjects',
    label: 'Subjects to be tutored',
    options: ['Chinese', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Politics']
  },
  {
    field: 'teacher_type',
    label: 'Teacher type',
    options: ['Full-time teacher', '985 student', 'None']
  },
  {
    field: 'teacher_gender',
    label: 'Teacher gender',
    options: ['Male', 'Female', 'None']
  },
  {
    field: 'district',
    label: 'District',
    options: ['Nankai District', 'Heping District', 'Hexi District', 'Hedong District', 'Hebei District', 'Hongqiao District', 'Jinnan District', 'Binhai New Area']
  },
  {
    field: 'student_level',
    label: 'Student level',
    options: ['Excellent', 'Good', 'Average', 'Fail']
  },
  {
    field: 'is_visible',
    label: 'Visible status',
    options: ['Yes', 'No']
  },
  {
    field: 'status',
    label: 'Order status',
    options: ['Completed', 'Uncompleted']
  }
]

// Get all filter field names
const FILTER_FIELDS = TUTOR_FILTERS.map(filter => filter.field)

/**
 * Get options for a specific filter field
 * @param {string} fieldName Field name
 * @returns {string[]} Array of options
 */
const getFilterOptions = (fieldName) => {
  const filter = TUTOR_FILTERS.find(f => f.field === fieldName)
  return filter?.options || []
}

module.exports = {
  TUTOR_FILTERS,
  FILTER_FIELDS,
  getFilterOptions
} 