import ComponentCard from "@/components/ComponentCard";
import { MagnifyingGlass, Crown } from "@phosphor-icons/react/dist/ssr";
import AnimatedCheckbox from "@/components/AnimatedCheckbox";

export default function Explore() {
  const exploreComponents = [
    { id: 1, title: 'Glassmorphism Login', author: 'AlexDev', avatar: 'https://i.pravatar.cc/150?img=11', likes: 342, isPro: false, preview: <div className="px-6 py-3 bg-white text-black rounded-lg font-bold">Login</div> },
    { id: 2, title: 'Neon Cyber Button', author: 'CyberPunk', avatar: 'https://i.pravatar.cc/150?img=22', likes: 890, isPro: false, preview: <div className="px-6 py-3 border-2 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] rounded-lg font-bold bg-transparent">Hover Me</div> },
    { id: 3, title: 'Advanced Sidebar', author: 'UIPro', avatar: 'https://i.pravatar.cc/150?img=33', likes: 1200, isPro: true, preview: <div className="w-20 h-full bg-gray-800 rounded-lg"></div> },
    { id: 4, title: 'Animated Toggle', author: 'MotionGuy', avatar: 'https://i.pravatar.cc/150?img=44', likes: 156, isPro: false, preview: <div className="w-14 h-8 bg-[var(--accent-1)] rounded-full relative"><div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full"></div></div> },
    { id: 5, title: 'Pricing Table', author: 'SaaSDesign', avatar: 'https://i.pravatar.cc/150?img=55', likes: 430, isPro: true, preview: <div className="w-24 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl"></div> },
    { id: 6, title: 'Pulse Loader', author: 'LoaderKing', avatar: 'https://i.pravatar.cc/150?img=66', likes: 210, isPro: false, preview: <div className="w-10 h-10 border-4 border-white border-t-[var(--accent-2)] rounded-full"></div> },
  ];

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        
        {/* Sidebar Filters */}
        <aside className="glass p-6 rounded-2xl h-fit">
          <div className="relative mb-6">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-[var(--accent-1)] transition-colors"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Category</h3>
            <div className="flex flex-col gap-3">
              <AnimatedCheckbox label="All Categories" defaultChecked />
              <AnimatedCheckbox label="Buttons" />
              <AnimatedCheckbox label="Cards" />
              <AnimatedCheckbox label="Inputs" />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Framework</h3>
            <div className="flex flex-col gap-3">
              <AnimatedCheckbox label="HTML/CSS" defaultChecked />
              <AnimatedCheckbox label="Tailwind CSS" />
              <AnimatedCheckbox label="React" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Sort By</h3>
            <select className="w-full bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[var(--accent-1)] cursor-pointer">
              <option>Trending</option>
              <option>Most Liked</option>
              <option>Newest</option>
            </select>
          </div>
        </aside>

        {/* Main Grid Content */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-[var(--text-muted)] font-medium">Showing {exploreComponents.length} components</h2>
            <div className="flex gap-3">
              <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--text-main)] text-[var(--bg-base)] transition-colors">
                Free
              </button>
              <button className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium border border-[var(--border-light)] bg-[var(--bg-surface)] hover:bg-[var(--text-main)] hover:text-[var(--bg-base)] transition-colors">
                Pro <Crown weight="fill" className="text-[var(--warning)]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {exploreComponents.map((comp) => (
              <ComponentCard 
                key={comp.id}
                title={comp.title}
                author={comp.author}
                avatar={comp.avatar}
                likes={comp.likes}
                isPro={comp.isPro}
                previewNode={comp.preview}
              />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}