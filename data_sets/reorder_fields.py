import json
from collections import OrderedDict

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def reorder_course_fields():
    courses_path = r'c:\해외인터십\I\data_sets\uni_courses_info.json'
    courses = load_json(courses_path)
    
    # Define the desired field order
    field_order = [
        'course_unique_id',
        'course_name',
        'credits',
        'major_id',
        'major_name',
        'sections',
        'year',
        'semester',
        'prerequisite_code',
        'recommended_courses'
    ]
    
    reordered_courses = []
    for course in courses:
        ordered_course = OrderedDict()
        # Add fields in the specified order
        for field in field_order:
            if field in course:
                ordered_course[field] = course[field]
        
        # Add any remaining fields that weren't in the order list
        for key, value in course.items():
            if key not in ordered_course:
                ordered_course[key] = value
        
        reordered_courses.append(dict(ordered_course))
    
    save_json(courses_path, reordered_courses)
    print(f"Successfully reordered fields in {courses_path}")

if __name__ == "__main__":
    reorder_course_fields()
