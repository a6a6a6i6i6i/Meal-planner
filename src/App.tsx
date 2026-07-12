import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const WeekPlannerPage = lazy(() => import("./pages/WeekPlannerPage"));
const MealLibraryPage = lazy(() => import("./pages/MealLibraryPage"));
const IngredientsPage = lazy(() => import("./pages/IngredientsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <TooltipProvider>
    <Toaster />
    <BrowserRouter basename="/Meal-planner">
      <Suspense>
        <Routes>
          <Route path="/" element={<WeekPlannerPage />} />
          <Route path="/library" element={<MealLibraryPage />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
