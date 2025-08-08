interface LogoProps {
  isDark?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ isDark = false, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-lg",
    md: "w-10 h-10 text-xl", 
    lg: "w-12 h-12 text-2xl",
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex items-center space-x-reverse space-x-3 logo-animation">
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500 to-success-500 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform`}>
        <i className={`fas fa-rocket ${isDark ? 'text-white' : 'text-white'} ${sizeClasses[size].split(' ')[2]} animate-pulse-slow`}></i>
      </div>
      <span className={`${textSizeClasses[size]} font-bold ${isDark ? 'text-white' : 'text-primary-600'} bg-gradient-to-r from-primary-600 to-success-600 bg-clip-text text-transparent`}>
        معك
      </span>
    </div>
  );
}
