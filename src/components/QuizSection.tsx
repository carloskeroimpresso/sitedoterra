import { Heart, Brain, Shield, Moon } from "lucide-react";

const options = [
  { icon: Moon, label: "Melhorar a qualidade do sono" },
  { icon: Brain, label: "Mais energia e foco" },
  { icon: Heart, label: "Reduzir estresse e ansiedade" },
  { icon: Shield, label: "Fortalecer a imunidade" },
];

const QuizSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Descubra os melhores óleos para você
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Responda rápido e receba uma recomendação personalizada baseada nos seus objetivos de saúde.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-[var(--card-shadow)] border border-border">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs text-muted-foreground">Pergunta 1/4</span>
              <span className="text-xs font-semibold text-primary">01/04</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Qual é o seu principal objetivo de saúde hoje?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((opt) => (
                <button
                  key={opt.label}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary hover:bg-accent transition-all text-left group"
                >
                  <opt.icon
                    size={20}
                    className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizSection;
