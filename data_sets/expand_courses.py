import json
import random

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def generate_courses():
    courses_path = r'c:\해외인터십\I\data_sets\uni_courses_info.json'
    majors_path = r'c:\해외인터십\I\data_sets\uni_majors_info.json'
    
    courses = load_json(courses_path)
    majors = load_json(majors_path)
    
    # Target courses per major (5 years * 2 sem * 5 courses = 50 courses)
    target_count = 50
    
    # Existing courses by major
    existing_courses = {}
    for c in courses:
        mid = c['major_id']
        if mid not in existing_courses:
            existing_courses[mid] = []
        existing_courses[mid].append(c)
        
    new_courses = []
    
    # Templates for course names
    prefixes = ["Introduction to", "Advanced", "Principles of", "Applied", "Fundamentals of", "Topics in", "Seminar in", "Research in", "Contemporary", "Global"]
    suffixes = ["Analysis", "Systems", "Design", "Management", "Theory", "Applications", "Development", "Studies", "Project", "Laboratory"]
    roman_numerals = ["I", "II", "III", "IV"]
    
    professor_names = ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown", "Dr. Jones", "Dr. Garcia", "Dr. Miller", "Dr. Davis", "Dr. Rodriguez", "Dr. Martinez"]
    locations = [f"Block {c}, Room {random.randint(100, 500)}" for c in "ABCDEFGHIJK"]
    
    for major in majors:
        mid = major['major_id']
        mname = major['major_name'].replace("Bachelor of ", "").replace(" (Hons)", "").replace("Doctor of ", "").replace("Diploma in ", "")
        
        current_courses = existing_courses.get(mid, [])
        current_count = len(current_courses)
        
        needed = target_count - current_count
        
        if needed <= 0:
            continue
            
        print(f"Generating {needed} courses for {mname} ({mid})...")
        
        # Determine last ID to increment
        last_id_num = 0
        if current_courses:
            # Assumes ID format AAA-BBB-CCCC (e.g., MED-001-1000)
            try:
                numeric_parts = [int(c['course_unique_id'].split('-')[-1]) for c in current_courses]
                last_id_num = max(numeric_parts)
            except:
                last_id_num = 1000
        else:
            last_id_num = 1000
            
        for i in range(needed):
            last_id_num += 1
            new_id = f"{mid}-{last_id_num}"
            
            # Generate a name
            if i < 10:
                name = f"{random.choice(prefixes)} {mname}"
            elif i < 20:
                name = f"{mname} {random.choice(suffixes)}"
            elif i < 30:
                name = f"Advanced {mname} {random.choice(suffixes)}"
            elif i < 40:
                name = f"{mname} Elective {random.choice(roman_numerals)}"
            else:
                name = f"{mname} Final Project {i-39}"
                
            # Create course object
            course = {
                "course_unique_id": new_id,
                "course_name": name,
                "credits": random.choice([2, 3, 4]),
                "major_id": mid,
                "major_name": major['major_name'],
                "sections": [
                    {
                        "professor_name": random.choice(professor_names),
                        "schedule": f"{random.choice(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])} {random.randint(8,16)}:00 - {random.randint(10,18)}:00",
                        "location": random.choice(locations),
                        "section_number": 1
                    }
                ],
                "prerequisite_code": None
            }
            courses.append(course)

    save_json(courses_path, courses)
    print(f"Total courses after expansion: {len(courses)}")

if __name__ == "__main__":
    generate_courses()
