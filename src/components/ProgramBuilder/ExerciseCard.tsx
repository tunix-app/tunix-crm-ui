import React from 'react';
import { PlusIcon, InfoIcon } from 'lucide-react';
import { Exercise } from '../../utils/mockData';
interface ExerciseCardProps {
  exercise: Exercise;
}
const ExerciseCard = ({
  exercise
}: ExerciseCardProps) => {
  return <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 overflow-hidden">
        <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{exercise.name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {exercise.muscle} • {exercise.equipment}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {exercise.tags.map(tag => <span key={tag} className={`text-xs px-2 py-1 rounded-full ${tag.includes('strength') ? 'bg-tan-100 text-blue-800' : tag.includes('mobility') ? 'bg-green-100 text-green-800' : tag.includes('rehab') ? 'bg-yellow-100 text-yellow-800' : tag.includes('recovery') ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
              {tag}
            </span>)}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className={`px-2 py-1 rounded text-xs font-medium ${exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
            {exercise.difficulty}
          </div>
          <div className="flex space-x-2">
            <button className="p-1.5 rounded-full hover:bg-gray-100">
              <InfoIcon size={18} className="text-gray-500" />
            </button>
            <button className="p-1.5 rounded-full bg-tan-100 hover:bg-tan-200">
              <PlusIcon size={18} className="text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default ExerciseCard;