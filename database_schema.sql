-- =====================================================
-- TSAR IT EdTech Platform - Complete Database Schema
-- Database: MySQL
-- Generated from JPA Entity classes
-- =====================================================

CREATE DATABASE IF NOT EXISTS tsarit;
USE tsarit;

-- =====================================================
-- 1. USERS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255),
    course VARCHAR(255),
    role VARCHAR(255),                          -- 'ADMIN' or 'STUDENT'
    total_fee DOUBLE,
    discount DOUBLE,
    certificate_issued BIT(1) DEFAULT 0,
    certificate_date VARCHAR(255),
    profile_picture VARCHAR(255)
);

-- =====================================================
-- 2. PASSWORD RESET TOKEN MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS password_reset_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255),
    user_id BIGINT NOT NULL,
    expiry_date DATETIME(6),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================
-- 3. COURSES MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255),
    live_link VARCHAR(255),
    total_fee DOUBLE,
    discount DOUBLE,
    duration VARCHAR(255) NOT NULL,
    level VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    icon_name VARCHAR(255),
    color VARCHAR(255),
    bg_color VARCHAR(255),
    border_color VARCHAR(255),
    gradient VARCHAR(255),
    shadow VARCHAR(255)
);

-- =====================================================
-- 4. SECTIONS MODULE (belongs to Course)
-- =====================================================

CREATE TABLE IF NOT EXISTS sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    course_id BIGINT,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- =====================================================
-- 5. VIDEOS MODULE (belongs to Section)
-- =====================================================

CREATE TABLE IF NOT EXISTS videos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    url VARCHAR(255),
    duration VARCHAR(255),
    type VARCHAR(255),                          -- 'youtube', 'local'
    section_id BIGINT,
    FOREIGN KEY (section_id) REFERENCES sections(id)
);

-- =====================================================
-- 6. QUIZZES MODULE (belongs to Section)
-- =====================================================

CREATE TABLE IF NOT EXISTS quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(2000),
    section_id BIGINT,
    FOREIGN KEY (section_id) REFERENCES sections(id)
);

-- =====================================================
-- 7. QUESTIONS MODULE (belongs to Quiz)
-- =====================================================

CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT,
    correct_option_index INT,
    quiz_id BIGINT,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

-- Question Options (ElementCollection table)
CREATE TABLE IF NOT EXISTS question_options (
    question_id BIGINT NOT NULL,
    option_text VARCHAR(255),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- =====================================================
-- 8. QUIZ ATTEMPTS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    quiz_id BIGINT,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    attempt_time DATETIME(6),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

-- =====================================================
-- 9. ENROLLMENTS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_name VARCHAR(255),
    enrollment_date DATE,
    status VARCHAR(255),                        -- 'ACTIVE', 'COMPLETED', 'CANCELLED'
    fee DOUBLE,
    discount DOUBLE,
    certificate_issued BIT(1) DEFAULT 0,
    certificate_date DATE,
    certificate_id VARCHAR(255),
    transaction_id VARCHAR(255),
    amount_paid DOUBLE,
    student_name VARCHAR(255),
    payment_time DATETIME(6),
    progress INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================
-- 10. WEBINARS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS webinars (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    speaker VARCHAR(255),
    date DATE,
    time TIME,
    description TEXT,
    meeting_link TEXT,
    image TEXT,
    is_paid BIT(1) DEFAULT 0,
    price DOUBLE
);

-- =====================================================
-- 11. WEBINAR REGISTRATIONS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS webinar_registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,                        -- NULL for guest registrations
    webinar_id BIGINT NOT NULL,
    registered_at DATETIME(6),
    student_name VARCHAR(255),
    student_email VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (webinar_id) REFERENCES webinars(id)
);

-- =====================================================
-- 12. HACKATHONS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS hackathons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    date VARCHAR(255),
    time VARCHAR(255),
    prize_pool VARCHAR(255),
    status VARCHAR(255),                        -- 'Upcoming', 'Live', 'Completed'
    mode VARCHAR(255),
    entry_fee VARCHAR(255)
);

-- Hackathon Registered Users (ElementCollection table)
CREATE TABLE IF NOT EXISTS hackathon_registered_user_ids (
    hackathon_id BIGINT NOT NULL,
    registered_user_ids BIGINT,
    FOREIGN KEY (hackathon_id) REFERENCES hackathons(id)
);

-- =====================================================
-- 13. PROBLEMS MODULE (Hackathon Coding Problems)
-- =====================================================

CREATE TABLE IF NOT EXISTS problems (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    difficulty VARCHAR(255),                    -- 'Easy', 'Medium', 'Hard'
    time_limit DOUBLE,                          -- in seconds
    memory_limit INT,                           -- in MB
    input_format TEXT,
    output_format TEXT,
    hackathon_id BIGINT
);

-- =====================================================
-- 14. TEST CASES MODULE (belongs to Problem)
-- =====================================================

CREATE TABLE IF NOT EXISTS test_cases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    input TEXT,
    expected_output TEXT,
    is_hidden BIT(1) DEFAULT 0,                 -- hidden from students
    explanation TEXT,
    problem_id BIGINT,
    FOREIGN KEY (problem_id) REFERENCES problems(id)
);

-- =====================================================
-- 15. SUBMISSIONS MODULE (Hackathon Submissions)
-- =====================================================

CREATE TABLE IF NOT EXISTS submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hackathon_id BIGINT,
    user_id BIGINT,
    project_title VARCHAR(255),
    repo_link VARCHAR(255),
    video_link VARCHAR(255),
    code TEXT,
    language VARCHAR(255),                      -- 'python', 'java', 'c++'
    status VARCHAR(255),                        -- 'ACCEPTED', 'WRONG_ANSWER', 'COMPILE_ERROR'
    passed_test_cases INT,
    total_test_cases INT,
    description VARCHAR(1000),
    score DOUBLE,
    feedback VARCHAR(255),
    winner BIT(1) DEFAULT 0,
    submitted_at DATETIME(6)
);

-- =====================================================
-- 16. TESTIMONIALS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS testimonials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    course VARCHAR(255),
    message VARCHAR(1000),
    image VARCHAR(1000),
    video_url VARCHAR(1000),
    thumbnail VARCHAR(1000)
);

-- =====================================================
-- 17. CONTACT QUERIES MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_queries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    subject VARCHAR(255),
    message TEXT,
    created_at DATETIME(6)
);

-- =====================================================
-- 18. ANTI-CHEAT LOGS MODULE
-- =====================================================

CREATE TABLE IF NOT EXISTS anti_cheat_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    hackathon_id BIGINT NOT NULL,
    tab_switch_count INT NOT NULL DEFAULT 0,
    last_updated DATETIME(6),
    UNIQUE KEY uk_user_hackathon (user_id, hackathon_id)
);
