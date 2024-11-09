import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Sun,
  Moon,
  Plus,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Timer {
  id: number;
  name: string;
  minutes: number;
  activity: string;
  color: string;
}

interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  card: string;
  border: string;
}

const DEFAULT_THEMES: Record<"light" | "dark", Theme> = {
  light: {
    primary: "#F9B5D0", // Rosa pastel
    secondary: "#A8E6CF", // Verde pastel
    background: "#FFDFD3", // Pêssego pastel
    text: "#4A4458", // Texto escuro
    card: "#FFE2E2", // Rosa claro
    border: "#D4D4D8", // Borda mais escura para contraste
  },
  dark: {
    primary: "#2D3436",
    secondary: "#434C5E",
    background: "#1F2937",
    text: "#F3F4F6", // Texto mais claro
    card: "#374151",
    border: "#4B5563", // Borda mais clara para contraste no modo escuro
  },
};

const DEFAULT_TIMERS = [
  { id: 1, name: "Pomodoro", minutes: 25, activity: "Foco", color: "#F9B5D0" },
  {
    id: 2,
    name: "Pausa Curta",
    minutes: 5,
    activity: "Descanso",
    color: "#A8E6CF",
  },
  {
    id: 3,
    name: "Pausa Longa",
    minutes: 15,
    activity: "Descanso Longo",
    color: "#FFDFD3",
  },
];

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const [timers, setTimers] = useState<Timer[]>(DEFAULT_TIMERS);
  const [currentTimer, setCurrentTimer] = useState<Timer>(DEFAULT_TIMERS[0]);
  const [time, setTime] = useState(currentTimer.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [customTheme, setCustomTheme] = useState(DEFAULT_THEMES);

  // Som de notificação
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const notificationSound = new Audio(
    "https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"
  );

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      if (soundEnabled) {
        notificationSound.play();
      }
      if ("Notification" in window) {
        new Notification("Timer Finalizado!", {
          body: `${currentTimer.name}: ${currentTimer.activity}`,
        });
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, time, currentTimer, soundEnabled, notificationSound]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleTimerSelect = (value: string) => {
    const selected = timers.find((t) => t.id === parseInt(value));
    if (selected) {
      setCurrentTimer(selected);
      setTime(selected.minutes * 60);
      setIsRunning(false);
    }
  };

  const handleTimerUpdate = (
    id: number,
    field: keyof Omit<Timer, "id">,
    value: string | number
  ) => {
    setTimers(
      timers.map((timer) =>
        timer.id === id ? { ...timer, [field]: value } : timer
      )
    );
  };

  const addNewTimer = () => {
    const newId = Math.max(...timers.map((t) => t.id)) + 1;
    const newTimer: Timer = {
      id: newId,
      name: "Novo Timer",
      minutes: 25,
      activity: "Nova Atividade",
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    };
    setTimers([...timers, newTimer]);
  };

  const deleteTimer = (id: number) => {
    if (timers.length > 1) {
      setTimers(timers.filter((t) => t.id !== id));
      if (currentTimer.id === id) {
        setCurrentTimer(timers[0]);
        setTime(timers[0].minutes * 60);
      }
    }
  };

  const updateTheme = (
    mode: "light" | "dark",
    property: keyof Theme,
    value: string
  ) => {
    setCustomTheme((prev) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [property]: value,
      },
    }));
  };

  const theme = isDark ? customTheme.dark : customTheme.light;

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        transition: "all 0.3s ease",
      }}
    >
      <div className="w-full max-w-md mx-auto">
        <Card
          className="shadow-lg w-[400px]"
          style={{ backgroundColor: theme.card }}
        >
          <CardHeader className="border-b border-border">
            <CardTitle
              className="flex justify-between items-center text-lg"
              style={{ color: theme.text }}
            >
              <span>Pomodoro Timer</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent"
                  onClick={() => setIsDark(!isDark)}
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {showSettings ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold" style={{ color: theme.text }}>
                    Timers
                  </h3>
                  {timers.map((timer) => (
                    <div key={timer.id} className="flex gap-2 items-center">
                      <Input
                        type="text"
                        value={timer.name}
                        onChange={(e) =>
                          handleTimerUpdate(timer.id, "name", e.target.value)
                        }
                        className="flex-1 border-2"
                        style={{ borderColor: theme.border }}
                      />
                      <Input
                        type="number"
                        value={timer.minutes}
                        onChange={(e) =>
                          handleTimerUpdate(
                            timer.id,
                            "minutes",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-20"
                        min="1"
                      />
                      <Input
                        type="text"
                        value={timer.activity}
                        onChange={(e) =>
                          handleTimerUpdate(
                            timer.id,
                            "activity",
                            e.target.value
                          )
                        }
                        className="flex-1"
                      />
                      <Input
                        type="color"
                        value={timer.color}
                        onChange={(e) =>
                          handleTimerUpdate(timer.id, "color", e.target.value)
                        }
                        className="w-12 h-8"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTimer(timer.id)}
                        disabled={timers.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addNewTimer} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Timer
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold" style={{ color: theme.text }}>
                      Personalizar Tema
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => setCustomTheme(DEFAULT_THEMES)}
                      size="sm"
                    >
                      Restaurar Padrão
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4
                        className="text-sm font-medium mb-2"
                        style={{ color: theme.text }}
                      >
                        Tema Claro
                      </h4>
                      {(
                        Object.keys(customTheme.light) as Array<keyof Theme>
                      ).map((key) => (
                        <div key={key} className="mb-2">
                          <label className="text-sm block mb-1">{key}</label>
                          <Input
                            type="color"
                            value={customTheme.light[key]}
                            onChange={(e) =>
                              updateTheme("light", key, e.target.value)
                            }
                            className="w-full border-2"
                            style={{ borderColor: theme.border }}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4
                        className="text-sm font-medium mb-2"
                        style={{ color: theme.text }}
                      >
                        Tema Escuro
                      </h4>
                      {(
                        Object.keys(customTheme.dark) as Array<keyof Theme>
                      ).map((key) => (
                        <div key={key} className="mb-2">
                          <label className="text-sm block mb-1">{key}</label>
                          <Input
                            type="color"
                            value={customTheme.dark[key]}
                            onChange={(e) =>
                              updateTheme("dark", key, e.target.value)
                            }
                            className="w-full border-2"
                            style={{ borderColor: theme.border }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <Select
                  value={String(currentTimer.id)}
                  onValueChange={handleTimerSelect}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um timer" />
                  </SelectTrigger>
                  <SelectContent>
                    {timers.map((timer) => (
                      <SelectItem key={timer.id} value={String(timer.id)}>
                        {timer.name} ({timer.minutes}min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="text-center space-y-4">
                  <h2
                    className="text-7xl font-bold tracking-tighter"
                    style={{ color: currentTimer.color }}
                  >
                    {formatTime(time)}
                  </h2>
                  <Alert className="bg-accent">
                    <AlertDescription>{currentTimer.activity}</AlertDescription>
                  </Alert>
                </div>

                <div className="flex justify-center gap-4">
                  {!isRunning ? (
                    <Button className="w-32" onClick={() => setIsRunning(true)}>
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar
                    </Button>
                  ) : (
                    <Button
                      className="w-32"
                      variant="secondary"
                      onClick={() => setIsRunning(false)}
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </Button>
                  )}
                  <Button
                    className="w-32"
                    variant="outline"
                    onClick={() => {
                      setIsRunning(false);
                      setTime(currentTimer.minutes * 60);
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reiniciar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
