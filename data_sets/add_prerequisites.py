import json
import random

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def add_prerequisites():
    courses_path = r'c:\해외인터십\I\data_sets\uni_courses_info.json'
    courses = load_json(courses_path)
    
    # Group courses by major_id
    courses_by_major = {}
    for course in courses:
        mid = course['major_id']
        if mid not in courses_by_major:
            courses_by_major[mid] = []
        courses_by_major[mid].append(course)
    
    # Process each major
    for major_id, major_courses in courses_by_major.items():
        # Sort by year and semester to ensure proper ordering
        major_courses.sort(key=lambda x: (x.get('year', 0), x.get('semester', 0)))
        
        # Build a list of courses by semester for easy lookup
        semesters = {}
        for course in major_courses:
            year = course.get('year', 1)
            sem = course.get('semester', 1)
            key = (year, sem)
            if key not in semesters:
                semesters[key] = []
            semesters[key].append(course)
        
        # Assign prerequisites
        for course in major_courses:
            year = course.get('year', 1)
            sem = course.get('semester', 1)
            
            # Year 1 Semester 1 courses have no prerequisites
            if year == 1 and sem == 1:
                course['prerequisite_code'] = None
                continue
            
            # Determine potential prerequisite pool
            prereq_pool = []
            
            # For Year 1 Sem 2, use Year 1 Sem 1 courses
            if year == 1 and sem == 2:
                prereq_pool = semesters.get((1, 1), [])
            
            # For later courses, use previous semester courses
            elif sem == 1:
                # First semester of year: use previous year's second semester
                prereq_pool = semesters.get((year - 1, 2), [])
            else:
                # Second semester: use same year's first semester
                prereq_pool = semesters.get((year, 1), [])
            
            # Randomly decide if this course should have a prerequisite (60% chance)
            if prereq_pool and random.random() < 0.6:
                # Pick 1 random prerequisite from the pool
                prereq = random.choice(prereq_pool)
                course['prerequisite_code'] = prereq['course_unique_id']
            else:
                course['prerequisite_code'] = None
    
    # Save updated courses
    save_json(courses_path, courses)
    print(f"Successfully added prerequisites to courses in {courses_path}")

if __name__ == "__main__":
    add_prerequisites()
