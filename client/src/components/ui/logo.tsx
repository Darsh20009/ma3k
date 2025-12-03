import logoImage from "@assets/Screenshot 2025-08-08 103454_1754640306183.png";

interface LogoProps {
  isDark?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export default function Logo({ isDark = false, size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <div className="flex items-center gap-3">
      <img 
        src={logoImage} 
        alt="معك الرقمية" 
        className={`${sizeClasses[size]} rounded-full object-cover shadow-lg transition-transform hover:scale-105`}
        data-testid="img-logo"
      />
      {showText && (
        <div className="flex flex-col">
          <span 
            className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-[#2d8a7a] via-[#5cb85c] to-[#6ec4a3] bg-clip-text text-transparent`}
            data-testid="text-logo-name"
          >
            معك
          </span>
          <span className="text-xs text-muted-foreground">الرقمية</span>
        </div>
      )}
    </div>
  );
}
