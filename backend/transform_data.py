import json
import os

INPUT_DIR = "data"
OUTPUT_DIR = "data"

def load_json(filename):
    with open(os.path.join(INPUT_DIR, filename), 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filename, data):
    with open(os.path.join(OUTPUT_DIR, filename), 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def transform_students_to_user_info():
    students = load_json("students.json")
    user_info = []

    for s in students:
        # Map fields
        user_id = str(s.get("student_id", s.get("STUDENT_NUMBER")))
        
        user = {
            "user_id": user_id,
            "name": s.get("STUDENT_NAME", ""),
            "major": s.get("PROGRAMME_NAME", ""),  # Using Programme Name as Major
            "grade": 1, # Default
            "credits": s.get("completed_credits", 0),
            "email": f"{user_id}@student.university.edu",
            "phone": "010-1234-5678",
            "address": "Student Dormitory",
            "profile_picture": "default_profile.png"
        }
        user_info.append(user)
    
    save_json("user_info.json", user_info)
    print(f"Transformed {len(user_info)} users to user_info.json")

def transform_credentials_to_login_info():
    creds = load_json("user_credentials.json")
    login_info = []

    for c in creds:
        # models.py Account: user_id (alias="user_id"), user_password
        # input: student_id, password
        account = {
            "user_id": c.get("student_id"),
            "user_password": c.get("password")
        }
        login_info.append(account)
    
    save_json("login_info.json", login_info)
    print(f"Transformed {len(login_info)} credentials to login_info.json")

def transform_courses_to_uni_courses_info():
    courses = load_json("courses.json")
    uni_courses = []

    for c in courses:
        # models.py Course: course_unique_id, course_name, credits, major_id, sections, prerequisite_code
        # input: course_id, name, credits, faculty_id
        
        uni_course = {
            "course_unique_id": c.get("course_id"),
            "course_name": c.get("name"),
            "credits": c.get("credits", 3),
            "major_id": c.get("faculty_id"), # Mapping faculty -> major
            "sections": [
                {
                    "professor_name": "Prof. Smith",
                    "schedule": "Wed 14:00-16:00",
                    "location": "Lecture Hall A",
                    "section_number": 1
                }
            ],
            "prerequisite_code": None
        }
        uni_courses.append(uni_course)

    save_json("uni_courses_info.json", uni_courses)
    print(f"Transformed {len(uni_courses)} courses to uni_courses_info.json")

def transform_faculties_to_uni_majors_info():
    faculties = load_json("faculties.json")
    majors = []

    for f in faculties:
        # models.py Major: major_id, major_name, campus_location
        # input: faculty_id, name, campus
        
        major = {
            "major_id": f.get("faculty_id"),
            "major_name": f.get("name"),
            "campus_location": f.get("campus")
        }
        majors.append(major)

    save_json("uni_majors_info.json", majors)
    print(f"Transformed {len(majors)} majors to uni_majors_info.json")

if __name__ == "__main__":
    try:
        transform_students_to_user_info()
        transform_credentials_to_login_info()
        transform_courses_to_uni_courses_info()
        transform_faculties_to_uni_majors_info()
        print("Transformation complete.")
    except Exception as e:
        print(f"Transformation failed: {e}")
