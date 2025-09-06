import React, { useState } from 'react';
import { SaveIcon, PlusIcon, TrashIcon, MoveIcon, ChevronDownIcon, ChevronUpIcon, SettingsIcon } from 'lucide-react';
import { Exercise } from '../../utils/mockData';
interface TemplateBuilderProps {
  program: {
    id: number;
    name: string;
    description: string;
    category: string;
    exercises: number[];
    createdAt: string;
  };
  exercises: Exercise[];
}
const TemplateBuilder = ({
  program,
  exercises
}: TemplateBuilderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [programName, setProgramName] = useState(program.name);
  const [programDescription, setProgramDescription] = useState(program.description);
  // Get exercises in the program
  const programExercises = program.exercises.map(id => exercises.find(exercise => exercise.id === id)!);
  return <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-start">
        <div className="flex-1">
          {isEditing ? <div>
              <input type="text" value={programName} onChange={e => setProgramName(e.target.value)} className="w-full text-lg font-medium mb-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea value={programDescription} onChange={e => setProgramDescription(e.target.value)} rows={2} className="w-full text-sm text-gray-600 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div> : <div>
              <h2 className="text-lg font-medium">{programName}</h2>
              <p className="text-sm text-gray-600 mt-1">{programDescription}</p>
            </div>}
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setIsEditing(!isEditing)} className="p-2 rounded-md hover:bg-gray-100">
            <SettingsIcon size={18} className="text-gray-500" />
          </button>
          <button className="flex items-center px-3 py-2 bg-tan-600 text-white rounded-md text-sm font-medium hover:bg-tan-700">
            <SaveIcon size={16} className="mr-1" />
            {isEditing ? 'Save Changes' : 'Save Template'}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium">Warm-up</h3>
            </div>
            {programExercises.filter(e => e.category === 'mobility').map((exercise, index) => <div key={exercise.id} className="border-b border-gray-200 last:border-b-0">
                  <div className="p-4 flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 mr-4">
                      <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-gray-500">
                        {exercise.equipment}
                      </p>
                    </div>
                    <div className="flex items-center mr-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">2 sets</div>
                        <div className="text-gray-500">10-12 reps</div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1.5 rounded-md hover:bg-gray-100">
                        <MoveIcon size={18} className="text-gray-500" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-gray-100">
                        <SettingsIcon size={18} className="text-gray-500" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-gray-100">
                        <TrashIcon size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>)}
            <div className="p-2 border-t border-gray-200 bg-gray-50">
              <button className="w-full py-2 flex items-center justify-center text-sm text-gray-600 hover:bg-gray-100 rounded">
                <PlusIcon size={16} className="mr-1" />
                Add Exercise
              </button>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium">Main Workout</h3>
            </div>
            {programExercises.filter(e => e.category === 'strength').map((exercise, index) => <div key={exercise.id} className="border-b border-gray-200 last:border-b-0">
                  <div className="p-4 flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 mr-4">
                      <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-gray-500">
                        {exercise.equipment}
                      </p>
                    </div>
                    <div className="flex items-center mr-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">
                          3-4 sets
                        </div>
                        <div className="text-gray-500">8-10 reps</div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1.5 rounded-md hover:bg-gray-100">
                        <MoveIcon size={18} className="text-gray-500" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-gray-100">
                        <SettingsIcon size={18} className="text-gray-500" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-gray-100">
                        <TrashIcon size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pl-18">
                    <div className="p-3 bg-tan-50 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-blue-900">
                          Progression Rules
                        </h5>
                        <button className="text-blue-600 hover:text-blue-800">
                          <SettingsIcon size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-blue-800">
                        When client completes 3 sets of 10 reps with good form,
                        increase weight by 5-10 lbs.
                      </p>
                    </div>
                  </div>
                </div>)}
            <div className="p-2 border-t border-gray-200 bg-gray-50">
              <button className="w-full py-2 flex items-center justify-center text-sm text-gray-600 hover:bg-gray-100 rounded">
                <PlusIcon size={16} className="mr-1" />
                Add Exercise
              </button>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium">Cool Down</h3>
            </div>
            <div className="p-2">
              <button className="w-full py-2 flex items-center justify-center text-sm text-gray-600 hover:bg-gray-100 rounded">
                <PlusIcon size={16} className="mr-1" />
                Add Exercise
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-tan-600 text-white rounded-md text-sm font-medium hover:bg-tan-700">
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default TemplateBuilder;