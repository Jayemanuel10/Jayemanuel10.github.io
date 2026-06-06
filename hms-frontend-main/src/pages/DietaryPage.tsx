import React, { useState } from "react";
import { Search, Plus, Filter, Grid, List, Calendar, Clock, Utensils, AlertCircle, User, MoreVertical, Download, Upload, Leaf, Apple, Coffee, Heart, AlertTriangle } from "lucide-react";
import { Modal } from "../components/Modal";
type MealType = "breakfast" | "lunch" | "dinner" | "snack";
type DietType = "regular" | "vegetarian" | "diabetic" | "low-sodium" | "liquid";
type MealStatus = "scheduled" | "in-preparation" | "delivered" | "completed";
interface Meal {
  id: string;
  name: string;
  type: MealType;
  dietType: DietType;
  status: MealStatus;
  time: string;
  patientName: string;
  patientId: string;
  room: string;
  calories: number;
  allergies?: string[];
  restrictions?: string[];
  nutritionalInfo: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}
const mockMeals: Meal[] = [{
  id: "M001",
  name: "Grilled Chicken Salad",
  type: "lunch",
  dietType: "regular",
  status: "scheduled",
  time: "12:30 PM",
  patientName: "John Smith",
  patientId: "P001",
  room: "201",
  calories: 450,
  allergies: ["nuts"],
  nutritionalInfo: {
    protein: 32,
    carbs: 25,
    fat: 18,
    fiber: 6
  }
}, {
  id: "M002",
  name: "Vegetable Soup",
  type: "dinner",
  dietType: "vegetarian",
  status: "in-preparation",
  time: "6:00 PM",
  patientName: "Emma Johnson",
  patientId: "P002",
  room: "305",
  calories: 280,
  restrictions: ["no-spicy"],
  nutritionalInfo: {
    protein: 12,
    carbs: 45,
    fat: 8,
    fiber: 9
  }
}, {
  id: "M003",
  name: "Diabetic Breakfast",
  type: "breakfast",
  dietType: "diabetic",
  status: "completed",
  time: "8:00 AM",
  patientName: "Robert Lee",
  patientId: "P003",
  room: "103",
  calories: 320,
  restrictions: ["low-sugar"],
  nutritionalInfo: {
    protein: 20,
    carbs: 30,
    fat: 12,
    fiber: 7
  }
}];
export const DietaryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<MealType | "all">("all");
  const [selectedDietType, setSelectedDietType] = useState<DietType | "all">("all");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showMealModal, setShowMealModal] = useState(false);
  const filteredMeals = mockMeals.filter(meal => {
    if (selectedType !== "all" && meal.type !== selectedType) return false;
    if (selectedDietType !== "all" && meal.dietType !== selectedDietType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return meal.name.toLowerCase().includes(query) || meal.patientName.toLowerCase().includes(query) || meal.patientId.toLowerCase().includes(query);
    }
    return true;
  });
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Dietary Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage patient meals and dietary requirements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Meal Plan
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search meals or patients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <select value={selectedType} onChange={e => setSelectedType(e.target.value as MealType)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Meals</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
            <select value={selectedDietType} onChange={e => setSelectedDietType(e.target.value as DietType)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Diets</option>
              <option value="regular">Regular</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="diabetic">Diabetic</option>
              <option value="low-sodium">Low Sodium</option>
              <option value="liquid">Liquid</option>
            </select>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Meal Details
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Diet Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMeals.map(meal => <tr key={meal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getMealTypeStyles(meal.type)}`}>
                          {getMealTypeIcon(meal.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {meal.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {meal.calories} calories
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white">
                            {meal.patientName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Room {meal.room}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {meal.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <DietTypeBadge type={meal.dietType} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={meal.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => {
                    setSelectedMeal(meal);
                    setShowMealModal(true);
                  }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="lg:hidden">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {filteredMeals.map(meal => <div key={meal.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getMealTypeStyles(meal.type)}`}>
                    {getMealTypeIcon(meal.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {meal.name}
                    </p>
                    <DietTypeBadge type={meal.dietType} className="mt-1" />
                  </div>
                </div>
                <StatusBadge status={meal.status} />
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Patient</p>
                    <p className="text-gray-900 dark:text-white">
                      {meal.patientName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Room</p>
                    <p className="text-gray-900 dark:text-white">{meal.room}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {meal.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {meal.calories} calories
                    </span>
                  </div>
                </div>
                {(meal.allergies || meal.restrictions) && <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    {meal.allergies && <div className="flex flex-wrap gap-1">
                        {meal.allergies.map(allergy => <span key={allergy} className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs">
                            Allergy: {allergy}
                          </span>)}
                      </div>}
                    {meal.restrictions && <div className="flex flex-wrap gap-1 mt-1">
                        {meal.restrictions.map(restriction => <span key={restriction} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full text-xs">
                            {restriction}
                          </span>)}
                      </div>}
                  </div>}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button onClick={() => {
                setSelectedMeal(meal);
                setShowMealModal(true);
              }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>)}
        </div>
      </div>
      <Modal isOpen={showMealModal} onClose={() => setShowMealModal(false)} title="Meal Details">
        {selectedMeal && <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${getMealTypeStyles(selectedMeal.type)}`}>
                {getMealTypeIcon(selectedMeal.type)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedMeal.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <DietTypeBadge type={selectedMeal.dietType} />
                  <StatusBadge status={selectedMeal.status} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Patient Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {selectedMeal.patientName} ({selectedMeal.patientId})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Room {selectedMeal.room}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Meal Schedule
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {selectedMeal.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {selectedMeal.calories} calories
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Nutritional Information
              </h4>
              <div className="grid grid-cols-4 gap-4">
                <NutritionCard label="Protein" value={selectedMeal.nutritionalInfo.protein} unit="g" />
                <NutritionCard label="Carbs" value={selectedMeal.nutritionalInfo.carbs} unit="g" />
                <NutritionCard label="Fat" value={selectedMeal.nutritionalInfo.fat} unit="g" />
                <NutritionCard label="Fiber" value={selectedMeal.nutritionalInfo.fiber} unit="g" />
              </div>
            </div>
            {(selectedMeal.allergies || selectedMeal.restrictions) && <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Dietary Restrictions
                </h4>
                <div className="space-y-2">
                  {selectedMeal.allergies && <div className="flex flex-wrap gap-2">
                      {selectedMeal.allergies.map(allergy => <span key={allergy} className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Allergy: {allergy}
                        </span>)}
                    </div>}
                  {selectedMeal.restrictions && <div className="flex flex-wrap gap-2">
                      {selectedMeal.restrictions.map(restriction => <span key={restriction} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full text-sm flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {restriction}
                        </span>)}
                    </div>}
                </div>
              </div>}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
                Update Status
              </button>
            </div>
          </div>}
      </Modal>
    </div>;
};
const StatusBadge = ({
  status,
  className = ""
}: {
  status: MealStatus;
  className?: string;
}) => {
  const styles = {
    scheduled: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    "in-preparation": "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    delivered: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    completed: "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]} ${className}`}>
      {status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>;
};
const DietTypeBadge = ({
  type,
  className = ""
}: {
  type: DietType;
  className?: string;
}) => {
  const styles = {
    regular: "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400",
    vegetarian: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    diabetic: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    "low-sodium": "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    liquid: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[type]} ${className}`}>
      {getDietTypeIcon(type)}
      {type.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>;
};
const NutritionCard = ({
  label,
  value,
  unit
}: {
  label: string;
  value: number;
  unit: string;
}) => <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
      {value}
      {unit}
    </p>
  </div>;
const getMealTypeStyles = (type: MealType): string => {
  const styles = {
    breakfast: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    lunch: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    dinner: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    snack: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
  };
  return styles[type];
};
const getMealTypeIcon = (type: MealType) => {
  switch (type) {
    case "breakfast":
      return <Coffee className="w-5 h-5" />;
    case "lunch":
      return <Utensils className="w-5 h-5" />;
    case "dinner":
      return <Utensils className="w-5 h-5" />;
    case "snack":
      return <Apple className="w-5 h-5" />;
  }
};
const getDietTypeIcon = (type: DietType) => {
  switch (type) {
    case "regular":
      return <Utensils className="w-3 h-3" />;
    case "vegetarian":
      return <Leaf className="w-3 h-3" />;
    case "diabetic":
      return <AlertCircle className="w-3 h-3" />;
    case "low-sodium":
      return <AlertCircle className="w-3 h-3" />;
    case "liquid":
      return <Coffee className="w-3 h-3" />;
  }
};