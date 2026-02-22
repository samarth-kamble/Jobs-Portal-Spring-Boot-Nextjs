import { Talents } from "../ui/talent";
import { SearchBar } from "../ui/talent-search-bar";

export const FindTalentsView = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-mine-shaft-950 via-mine-shaft-900 to-mine-shaft-950">
      <div className="relative overflow-hidden">

        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/6 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 bg-linear-to-r from-foreground via-primary/80 to-foreground bg-clip-text text-transparent">
              Find Your Dream Talent
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Discover top talents from around the world and connect with them
              to get started on your journey to success.
            </p>
          </div>

          <SearchBar />
          <Talents />
        </div>
      </div>
    </div>
  );
};
