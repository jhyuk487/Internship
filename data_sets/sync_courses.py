import json

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def sync_courses():
    majors_path = r'c:\해외인터십\I\data_sets\uni_majors_info.json'
    courses_path = r'c:\해외인터십\I\data_sets\uni_courses_info.json'

    majors = load_json(majors_path)
    original_courses = load_json(courses_path)
    
    # Create a map of course_unique_id -> course object from original to preserve other fields
    course_map = {c['course_unique_id']: c for c in original_courses}
    
    new_courses_list = []
    
    # Iterate through the structured curriculum in majors
    for major in majors:
        if 'curriculum' not in major:
            continue
            
        for year_obj in major['curriculum']:
            year = year_obj['year']
            for sem_obj in year_obj['semesters']:
                semester = sem_obj['semester']
                
                for course_ref in sem_obj['courses']:
                    cid = course_ref['course_unique_id']
                    
                    # Get the full course object
                    if cid in course_map:
                        course_data = course_map[cid].copy()
                        
                        # Add metadata
                        course_data['year'] = year
                        course_data['semester'] = semester
                        
                        new_courses_list.append(course_data)
                    else:
                        print(f"Warning: Course {cid} found in curriculum but not in courses file.")

    # Sort by major_id, then year, then semester for cleanliness
    # new_courses_list.sort(key=lambda x: (x['major_id'], x.get('year', 0), x.get('semester', 0)))
    # Keeping traversal order as requested by user
    pass

    # Save the new filtered and updated list
    save_json(courses_path, new_courses_list)
    print(f"Successfully synced {len(new_courses_list)} courses to {courses_path}.")

if __name__ == "__main__":
    sync_courses()
