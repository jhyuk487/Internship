import json

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def add_recommended_courses():
    courses_path = r'c:\해외인터십\I\data_sets\uni_courses_info.json'
    courses = load_json(courses_path)
    
    # Create a map for quick lookup
    course_map = {c['course_unique_id']: c for c in courses}
    
    # Initialize recommended_courses as empty list for all courses
    for course in courses:
        course['recommended_courses'] = []
    
    # Build the inverse relationship
    # If A has prerequisite B, then B should recommend A
    for course in courses:
        prereq = course.get('prerequisite_code')
        if prereq and prereq in course_map:
            # Add this course to the prerequisite's recommended list
            course_map[prereq]['recommended_courses'].append(course['course_unique_id'])
    
    # Save updated courses
    save_json(courses_path, courses)
    print(f"Successfully added recommended_courses to {courses_path}")
    
    # Print some statistics
    with_recommendations = sum(1 for c in courses if c['recommended_courses'])
    print(f"Courses with recommendations: {with_recommendations}/{len(courses)}")

if __name__ == "__main__":
    add_recommended_courses()
