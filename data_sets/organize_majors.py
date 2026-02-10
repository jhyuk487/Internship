import json
import math

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def organize_majors():
    majors_path = r'c:\해외인터십\I\data_sets\uni_majors_info.json'
    courses_path = r'c:\해외인터십\I\data_sets\uni_courses_info.json'

    majors = load_json(majors_path)
    courses = load_json(courses_path)

    # Group courses by major_id
    courses_by_major = {}
    for course in courses:
        m_id = course['major_id']
        if m_id not in courses_by_major:
            courses_by_major[m_id] = []
        courses_by_major[m_id].append(course)

    # Process each major
    for major in majors:
        m_id = major['major_id']
        major_courses = courses_by_major.get(m_id, [])
        
        # Sort courses by unique ID to maintain some order (assuming ID reflects level)
        major_courses.sort(key=lambda x: x['course_unique_id'])

        # Distribution logic:
        # Assume 3 semesters per year (common in Malaysia private unis: Jan, May, Sept)
        # Target ~15-20 credits per semester or ~5-6 courses.
        # Let's aim for 5 courses per semester for simplicity.
        
        courses_per_sem = 5
        max_sems_per_year = 2
        
        structure = []
        
        if not major_courses:
            major['year_structure'] = []
            continue

        total_courses = len(major_courses)
        current_course_idx = 0
        year = 1
        
        # Loop until all courses are assigned or year 4 is reached
        while current_course_idx < total_courses and year <= 4:
            year_obj = {
                "year": year,
                "semesters": []
            }
            
            for sem in range(1, max_sems_per_year + 1):
                if current_course_idx >= total_courses:
                    break
                
                # Take next batch of courses
                sem_courses_full = major_courses[current_course_idx : current_course_idx + courses_per_sem]
                current_course_idx += len(sem_courses_full)
                
                # Store only the unique ID as a simple list of strings
                sem_courses_simple = [c["course_unique_id"] for c in sem_courses_full]
                
                semester_obj = {
                    "semester": sem,
                    "courses": sem_courses_simple
                }
                year_obj["semesters"].append(semester_obj)
            
            structure.append(year_obj)
            year += 1
            
        major['curriculum'] = structure # Using 'curriculum' as the key for the new structure

    # Save the updated majors file
    save_json(majors_path, majors)
    print(f"Successfully updated {majors_path} with curriculum data.")

if __name__ == "__main__":
    organize_majors()
