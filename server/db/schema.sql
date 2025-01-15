--create database
CREATE DATABASE school_prep;

-- Add Class Levels Table
CREATE TABLE class_levels (
    class_id SERIAL PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'Year 3', 'Year 4', 'Year 5'
    description TEXT
);

-- Create Subjects Table
CREATE TABLE subjects (
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL UNIQUE, --e.g. Selective Math, Selective Thinking Skills
    description TEXT,
    class_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (class_id) REFERENCES class_levels(class_id)

);

-- Create Units/chapters
CREATE TABLE units (
    unit_id SERIAL PRIMARY KEY,
    unit_name TEXT NOT NULL, --e.g. Unit 1, unit 2, Algebra etc
    subject_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

-- Create Exams Table
CREATE TABLE exams (
    exam_id SERIAL PRIMARY KEY,
    exam_name TEXT NOT NULL,
    subject_id INTEGER NOT NULL,
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
    time_limit_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);


--Create Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    pwd TEXT NOT NULL,
    is_active BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--Create roles table
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    rolename TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL, --a bit redundant info for this table as unit_id is already linked to subject_id in units table
    unit_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(100) DEFAULT 'mc', -- Example types: mc for 'multiple-choice', tf for 'true/false'
    explanation TEXT,
    points NUMERIC(5,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    media_path TEXT,

    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (unit_id) REFERENCES units(unit_id)
);

-- Create Options Table
CREATE TABLE question_options (
    option_id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

CREATE TABLE user_quiz_attempts (
    attempt_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    quiz_id INT REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    score DECIMAL(5, 2),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Create Exam Results Table
CREATE TABLE exam_results (
    result_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    exam_id INTEGER NOT NULL,
    total_score NUMERIC(5,2),
    total_questions INTEGER,
    correct_answers INTEGER,
    completion_time INTERVAL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id)
);

-- Create Exercise History Table
CREATE TABLE exercise_history (
    exercise_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    unit_id INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    total_score NUMERIC(5,2),
    total_questions INTEGER,
    correct_answers INTEGER,
    completion_time INTERVAL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (unit_id) REFERENCES units(unit_id)
);
ALTER TABLE exercise_history
ADD CONSTRAINT unique_user_unit UNIQUE (user_id, unit_id);

--create lessons table
CREATE TABLE lessons (
    lesson_id SERIAL PRIMARY KEY,
    unit_id INT REFERENCES units(unit_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- HTML content with embedded media
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- create lesson history
-- Create Exercise History Table
CREATE TABLE lesson_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    unit_id INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (unit_id) REFERENCES units(unit_id),
    -- Ensure user_id and unit_id combination is unique
    UNIQUE (user_id, unit_id)
);

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
-- Create Indexes for Performance
CREATE INDEX idx_subject_name ON subjects(subject_name);
CREATE INDEX idx_exam_subject ON exams(subject_id);
CREATE INDEX idx_question_exam ON questions(exam_id);
CREATE INDEX idx_options_question ON question_options(question_id);
CREATE INDEX idx_results_user ON exam_results(user_id);
CREATE INDEX idx_results_exam ON exam_results(exam_id);