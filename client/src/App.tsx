import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Curriculum from "./pages/Curriculum";
import Learn from "./pages/Learn";
import Checkout from "./pages/Checkout";
import Policies from "./pages/Policies";
import SkillsPassport from "./pages/SkillsPassport";
import CareerToolkit from "./pages/CareerToolkit";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/curriculum"} component={Curriculum} />
      <Route path={"/learn"} component={Learn} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/policies"} component={Policies} />
      <Route path={"/skills-passport"} component={SkillsPassport} />
      <Route path={"/career-toolkit"} component={CareerToolkit} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
