import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Certificate from "@/pages/Certificate";
import CourseDashboard from "@/pages/CourseDashboard";
import CourseModule from "@/pages/CourseModule";
import JoinPractice from "@/pages/JoinPractice";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Curriculum from "./pages/Curriculum";
import EnrollmentSuccess from "./pages/EnrollmentSuccess";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/curriculum" component={Curriculum} />
      <Route path="/enrollment/success" component={EnrollmentSuccess} />
      <Route path="/login" component={Login} />
      <Route path="/join/:code" component={JoinPractice} />
      <Route path="/course/module/:day" component={CourseModule} />
      <Route path="/course/certificate" component={Certificate} />
      <Route path="/course" component={CourseDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
