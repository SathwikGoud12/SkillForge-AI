import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen,
    GraduationCap,
    Calendar,
    ChevronRight,
    Home
} from "lucide-react";
import StudyMaterialsService from "@/appwrite/StudyMaterialsService";
import { useNavigate } from "react-router";

const studyMaterialsService = new StudyMaterialsService();

const StudyMaterials = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);

    // Mock data for demonstration
    const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

    const branches = [
        { id: "CSE", name: "Computer Science Engineering", color: "from-blue-500 to-cyan-500" },
        { id: "ECE", name: "Electronics & Communication", color: "from-purple-500 to-pink-500" },
        { id: "EEE", name: "Electrical & Electronics", color: "from-yellow-500 to-orange-500" },
        { id: "IT", name: "Information Technology", color: "from-green-500 to-emerald-500" },
        { id: "MECH", name: "Mechanical Engineering", color: "from-red-500 to-rose-500" },
        { id: "CIVIL", name: "Civil Engineering", color: "from-indigo-500 to-blue-500" }
    ];

    const semesters = ["Semester 1", "Semester 2"];

    // Mock subjects - Replace with real API call
    const mockSubjects = [
        {
            $id: "1",
            Subjects: "Data Structures & Algorithms",
            Year: selectedYear,
            Branch: selectedBranch,
            Semester: selectedSemester,
            icon: "📊"
        },
        {
            $id: "2",
            Subjects: "Database Management Systems",
            Year: selectedYear,
            Branch: selectedBranch,
            Semester: selectedSemester,
            icon: "🗄️"
        },
        {
            $id: "3",
            Subjects: "Operating Systems",
            Year: selectedYear,
            Branch: selectedBranch,
            Semester: selectedSemester,
            icon: "💻"
        },
        {
            $id: "4",
            Subjects: "Computer Networks",
            Year: selectedYear,
            Branch: selectedBranch,
            Semester: selectedSemester,
            icon: "🌐"
        },
        {
            $id: "5",
            Subjects: "Software Engineering",
            Year: selectedYear,
            Branch: selectedBranch,
            Semester: selectedSemester,
            icon: "⚙️"
        },
        {
            $id: "6",
            Subjects: "Web Technologies",
            Year: selectedYear,
            Branch: selectedBranch,
            Semester: selectedSemester,
            icon: "🌍"
        }
    ];

    useEffect(() => {
        if (currentStep === 4) {
            loadSubjects();
        }
    }, [currentStep]);

    const loadSubjects = async () => {
        setLoading(true);
        try {
            // Uncomment when ready to use real API
            // const data = await studyMaterialsService.getSubjects(
            //     selectedYear,
            //     selectedBranch,
            //     selectedSemester
            // );
            // setSubjects(data);

            // Using mock data for now
            setTimeout(() => {
                setSubjects(mockSubjects);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error("Error loading subjects:", error);
            setLoading(false);
        }
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        setCurrentStep(2);
    };

    const handleBranchSelect = (branch) => {
        setSelectedBranch(branch.id);
        setCurrentStep(3);
    };

    const handleSemesterSelect = (semester) => {
        setSelectedSemester(semester);
        setCurrentStep(4);
    };

    const handleSubjectClick = (subject) => {
        navigate(`/user/study-materials/subject/${subject.$id}`, {
            state: { subject }
        });
    };

    const handleReset = () => {
        setCurrentStep(1);
        setSelectedYear(null);
        setSelectedBranch(null);
        setSelectedSemester(null);
        setSubjects([]);
    };

    const steps = [
        { number: 1, label: "Year", value: selectedYear },
        { number: 2, label: "Branch", value: selectedBranch },
        { number: 3, label: "Semester", value: selectedSemester },
        { number: 4, label: "Subjects", value: subjects.length > 0 ? `${subjects.length} subjects` : null }
    ];

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                                <BookOpen className="w-10 h-10 text-blue-600" />
                                Study Materials
                            </h1>
                            <p className="text-slate-600">Access your academic resources</p>
                        </div>
                        {currentStep > 1 && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleReset}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Start Over
                            </motion.button>
                        )}
                    </div>

                    {/* Breadcrumb / Step Indicator */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.number}>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${step.number === currentStep
                                        ? "bg-blue-100 text-blue-700"
                                        : step.number < currentStep
                                            ? "bg-green-100 text-green-700"
                                            : "bg-slate-100 text-slate-400"
                                    }`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step.number === currentStep
                                            ? "bg-blue-600 text-white"
                                            : step.number < currentStep
                                                ? "bg-green-600 text-white"
                                                : "bg-slate-300 text-slate-500"
                                        }`}>
                                        {step.number}
                                    </div>
                                    <span className="font-semibold text-sm">
                                        {step.label}
                                        {step.value && `: ${step.value}`}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    {/* Step 1: Select Year */}
                    {currentStep === 1 && (
                        <motion.div
                            key="year"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {years.map((year, index) => (
                                <motion.button
                                    key={year}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleYearSelect(year)}
                                    className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all group"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <GraduationCap className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{year}</h3>
                                    <p className="text-slate-600 text-sm">Select to continue</p>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}

                    {/* Step 2: Select Branch */}
                    {currentStep === 2 && (
                        <motion.div
                            key="branch"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {branches.map((branch, index) => (
                                <motion.button
                                    key={branch.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleBranchSelect(branch)}
                                    className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all group text-left"
                                >
                                    <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${branch.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{branch.id}</h3>
                                    <p className="text-slate-600 text-sm">{branch.name}</p>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}

                    {/* Step 3: Select Semester */}
                    {currentStep === 3 && (
                        <motion.div
                            key="semester"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
                        >
                            {semesters.map((semester, index) => (
                                <motion.button
                                    key={semester}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSemesterSelect(semester)}
                                    className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all group"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Calendar className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{semester}</h3>
                                    <p className="text-slate-600 text-sm">View subjects</p>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}

                    {/* Step 4: Show Subjects */}
                    {currentStep === 4 && (
                        <motion.div
                            key="subjects"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {subjects.map((subject, index) => (
                                        <motion.button
                                            key={subject.$id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleSubjectClick(subject)}
                                            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all group text-left"
                                        >
                                            <div className="text-4xl mb-4">{subject.icon}</div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {subject.Subjects}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">
                                                    {subject.Year}
                                                </span>
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">
                                                    {subject.Branch}
                                                </span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StudyMaterials;
