import React, { useState } from 'react';
import { SearchIcon, PlusIcon, SaveIcon, FolderIcon, TagIcon, CopyIcon, TrashIcon } from 'lucide-react';
import ExerciseCard from '../components/ProgramBuilder/ExerciseCard';
import TemplateBuilder from '../components/ProgramBuilder/TemplateBuilder';
import { Exercise } from '../utils/mockData';
const ProgramBuilder = () => {
  const [activeTab, setActiveTab] = useState<'exercises' | 'templates'>('exercises');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  // Mock exercise data
  const exercises: Exercise[] = [{
    id: 1,
    name: 'Barbell Back Squat',
    category: 'strength',
    muscle: 'Quadriceps',
    difficulty: 'intermediate',
    equipment: 'Barbell',
    description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes.',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    tags: ['strength', 'lower body', 'compound']
  }, {
    id: 2,
    name: 'Romanian Deadlift',
    category: 'strength',
    muscle: 'Hamstrings',
    difficulty: 'intermediate',
    equipment: 'Barbell',
    description: 'A hip-hinge movement that targets the posterior chain.',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    tags: ['strength', 'lower body', 'hinge']
  }, {
    id: 3,
    name: 'Bench Press',
    category: 'strength',
    muscle: 'Chest',
    difficulty: 'intermediate',
    equipment: 'Barbell',
    description: 'A horizontal pressing movement that targets the chest, shoulders, and triceps.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    tags: ['strength', 'upper body', 'push']
  }, {
    id: 4,
    name: 'Pull-up',
    category: 'strength',
    muscle: 'Back',
    difficulty: 'advanced',
    equipment: 'Pull-up Bar',
    description: 'A vertical pulling movement that targets the back and biceps.',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    tags: ['strength', 'upper body', 'pull']
  }, {
    id: 5,
    name: 'Hip Mobility Flow',
    category: 'mobility',
    muscle: 'Hips',
    difficulty: 'beginner',
    equipment: 'None',
    description: 'A series of movements to improve hip mobility and function.',
    image: 'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    tags: ['mobility', 'lower body', 'recovery']
  }, {
    id: 6,
    name: 'Shoulder Dislocates',
    category: 'mobility',
    muscle: 'Shoulders',
    difficulty: 'beginner',
    equipment: 'Resistance Band',
    description: 'An exercise to improve shoulder mobility and function.',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    tags: ['mobility', 'upper body', 'prehab']
  }, {
    id: 7,
    name: 'Ankle Mobility Routine',
    category: 'rehab',
    muscle: 'Ankles',
    difficulty: 'beginner',
    equipment: 'None',
    description: 'A series of exercises to improve ankle mobility after injury.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    tags: ['rehab', 'lower body', 'recovery']
  }, {
    id: 8,
    name: 'Rotator Cuff Strengthening',
    category: 'rehab',
    muscle: 'Shoulders',
    difficulty: 'beginner',
    equipment: 'Dumbbells',
    description: 'Exercises to strengthen the rotator cuff muscles.',
    image: 'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    tags: ['rehab', 'upper body', 'prehab']
  }];
  // Mock template programs
  const templatePrograms = [{
    id: 1,
    name: 'Beginner Strength Program',
    description: 'A 4-week program for beginners focusing on building foundational strength.',
    category: 'strength',
    exercises: [1, 2, 3, 4],
    createdAt: '2023-04-10'
  }, {
    id: 2,
    name: 'Mobility Restoration',
    description: 'A comprehensive mobility program targeting common restrictions.',
    category: 'mobility',
    exercises: [5, 6],
    createdAt: '2023-05-22'
  }, {
    id: 3,
    name: 'Post-Injury Rehab',
    description: 'Rehabilitation program for common injuries.',
    category: 'rehab',
    exercises: [7, 8],
    createdAt: '2023-06-15'
  }];
  // Filter exercises based on search term and category
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) || exercise.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? exercise.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  // Get unique categories for filter
  const categories = Array.from(new Set(exercises.map(exercise => exercise.category)));
  return <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Program Builder</h1>
        {/* <p className="text-gray-600">
          Create and manage exercise programs for your clients
        </p> */}
      </div>
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button className={`px-6 py-4 font-medium text-sm ${activeTab === 'exercises' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('exercises')}>
              Exercise Library
            </button>
            <button className={`px-6 py-4 font-medium text-sm ${activeTab === 'templates' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('templates')}>
              Program Templates
            </button>
          </div>
        </div>
        {activeTab === 'exercises' ? <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input type="text" placeholder="Search exercises..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Filter:</span>
                <div className="flex space-x-1">
                  {categories.map(category => <button key={category} onClick={() => setSelectedCategory(selectedCategory === category ? null : category)} className={`px-3 py-1 text-sm rounded-md ${selectedCategory === category ? category === 'strength' ? 'bg-tan-100 text-blue-800' : category === 'mobility' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>)}
                </div>
                <button className="flex items-center px-3 py-2 bg-tan-600 text-white rounded-md text-sm font-medium hover:bg-tan-700 ml-2">
                  <PlusIcon size={16} className="mr-1" />
                  Add Exercise
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredExercises.map(exercise => <ExerciseCard key={exercise.id} exercise={exercise} />)}
              </div>
            </div>
          </div> : <div className="flex-1 flex">
            <div className="w-80 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input type="text" placeholder="Search templates..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {templatePrograms.map(program => <button key={program.id} className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 ${selectedProgram === program.id ? 'bg-tan-50' : ''}`} onClick={() => setSelectedProgram(program.id)}>
                    <div className="flex items-start">
                      <div className={`p-2 rounded-md mr-3 ${program.category === 'strength' ? 'bg-tan-100' : program.category === 'mobility' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        <FolderIcon size={16} className={program.category === 'strength' ? 'text-blue-600' : program.category === 'mobility' ? 'text-green-600' : 'text-yellow-600'} />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{program.name}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {program.description}
                        </p>
                        <div className="flex items-center mt-2">
                          <TagIcon size={12} className="text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">
                            {program.category}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            {program.exercises.length} exercises
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>)}
              </div>
              <div className="p-4 border-t border-gray-200">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-tan-600 text-white rounded-md text-sm font-medium hover:bg-tan-700">
                  <PlusIcon size={16} className="mr-1" />
                  New Template
                </button>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              {selectedProgram ? <TemplateBuilder program={templatePrograms.find(p => p.id === selectedProgram)!} exercises={exercises} /> : <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FolderIcon size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">
                      No Template Selected
                    </h3>
                    <p className="text-gray-500 mt-2 max-w-sm">
                      Select a template from the sidebar or create a new one to
                      get started.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-tan-600 text-white rounded-md text-sm font-medium hover:bg-tan-700">
                      Create New Template
                    </button>
                  </div>
                </div>}
            </div>
          </div>}
      </div>
    </div>;
};
export default ProgramBuilder;