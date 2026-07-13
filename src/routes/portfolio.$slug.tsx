import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  Tag,
  Play,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Video,
  Image as ImageIcon,
  Folder,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { projects, type Project } from "@/content/projects";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeSupabaseUrl } from "@/lib/utils";

export const Route = createFileRoute("/portfolio/$slug")({
  staleTime: 0,
  gcTime: 0,
  loader: async ({ params }) => {
    try {
      const { data: dbProject, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", params.slug)
        .maybeSingle();

      const staticProject = projects.find((p) => p.slug === params.slug);

      if (error || !dbProject) {
        if (!staticProject) throw notFound();
        return { project: staticProject };
      }

      const mappedProject: Project = {
        slug: dbProject.slug,
        title: dbProject.title,
        client: dbProject.client || "",
        location: dbProject.location || "",
        category: (dbProject.category || "Roads") as any,
        status: (dbProject.status || "Completed") as any,
        year: dbProject.year || "",
        summary: dbProject.summary || "",
        scope: dbProject.scope || [],
        cover: sanitizeSupabaseUrl(dbProject.cover_url || staticProject?.cover || ""),
        gallery: sanitizeSupabaseUrl((dbProject.gallery && dbProject.gallery.length > 0) ? dbProject.gallery : (staticProject?.gallery || [])),
        videos: ((dbProject as any).videos || staticProject?.videos || []).map((v: any) => ({
          ...v,
          url: sanitizeSupabaseUrl(v.url),
          thumbnail: v.thumbnail ? sanitizeSupabaseUrl(v.thumbnail) : undefined,
        })),
      };

      return { project: mappedProject };
    } catch (err) {
      console.error("Loader failed to fetch project from Supabase, using fallback:", err);
      const staticProject = projects.find((p) => p.slug === params.slug);
      if (!staticProject) throw notFound();
      return { project: staticProject };
    }
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return { meta: [{ title: "Project — EKOWILLS" }] };
    return {
      meta: [
        { title: `${p.title} — EKOWILLS` },
        { name: "description", content: p.summary },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.summary },
        { property: "og:image", content: p.cover },
      ],
    };
  },
  component: ProjectPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-x py-32 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Project not found</h1>
        <Link to="/portfolio" className="mt-6 inline-block text-accent hover:underline">
          ← Back to portfolio
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ reset }) => (
    <SiteLayout>
      <div className="container-x py-32 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Couldn't load this project</h1>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground transition-all hover:bg-primary/95"
        >
          Try again
        </button>
      </div>
    </SiteLayout>
  ),
});

function ProjectPage() {
  const { project: p } = Route.useLoaderData() as { project: Project };
  
  // Interactive gallery states
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  
  // Video playback states
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string | null>(null);

  // Gallery Navigation Functions
  const handlePrevImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => 
      prev !== null ? (prev - 1 + p.gallery.length) % p.gallery.length : null
    );
  };

  const handleNextImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => 
      prev !== null ? (prev + 1) % p.gallery.length : null
    );
  };

  // Keyboard navigation for image lightbox
  useEffect(() => {
    if (activeImageIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevImage();
      else if (e.key === "ArrowRight") handleNextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex]);

  return (
    <SiteLayout>
      {/* Top Banner / Navigation */}
      <section className="border-b border-border bg-secondary/30 relative overflow-hidden py-10">
        <div className="absolute inset-0 bg-radial-gradient from-accent/5 to-transparent pointer-events-none" />
        <div className="container-x relative">
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link to="/portfolio" className="hover:text-foreground transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Portfolio
            </Link>
            <span>/</span>
            <span className="capitalize">{p.category.toLowerCase()}</span>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-xs">{p.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              p.status === "Completed" 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                p.status === "Completed" ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-pulse"
              }`} />
              {p.status}
            </span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/60 px-3 py-1 rounded-full font-medium">
              {p.year}
            </span>
          </div>

          <h1 className="mt-4 max-w-4xl text-3xl leading-[1.1] tracking-tight md:text-5xl font-extrabold text-foreground">
            {p.title}
          </h1>
        </div>
      </section>

      {/* Main Project Details Grid */}
      <section className="container-x py-12">
        {/* Project Meta Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-accent/20">
            <div className="rounded-lg bg-accent/10 p-3 text-accent">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground font-semibold">Client</div>
              <div className="mt-1 text-sm font-medium text-foreground">{p.client}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-accent/20">
            <div className="rounded-lg bg-accent/10 p-3 text-accent">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground font-semibold">Location</div>
              <div className="mt-1 text-sm font-medium text-foreground line-clamp-2 leading-snug">{p.location}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-accent/20">
            <div className="rounded-lg bg-accent/10 p-3 text-accent">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground font-semibold">Project Year</div>
              <div className="mt-1 text-sm font-medium text-foreground">{p.year}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-accent/20">
            <div className="rounded-lg bg-accent/10 p-3 text-accent">
              <Folder className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground font-semibold">Category</div>
              <div className="mt-1 text-sm font-medium text-foreground">{p.category}</div>
            </div>
          </div>
        </div>

        {/* Media and Overview Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex w-full max-w-md bg-secondary/50 border border-border p-1 rounded-xl mb-8">
            <TabsTrigger value="overview" className="flex-1 rounded-lg py-2.5 text-xs font-semibold cursor-pointer">
              Overview
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex-1 rounded-lg py-2.5 text-xs font-semibold cursor-pointer gap-1.5">
              <ImageIcon className="h-3.5 w-3.5" />
              Photos ({p.gallery.length})
            </TabsTrigger>
            {p.videos && p.videos.length > 0 && (
              <TabsTrigger value="videos" className="flex-1 rounded-lg py-2.5 text-xs font-semibold cursor-pointer gap-1.5">
                <Video className="h-3.5 w-3.5" />
                Videos ({p.videos.length})
              </TabsTrigger>
            )}
          </TabsList>

          {/* Overview Content */}
          <TabsContent value="overview" className="space-y-12">
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Text details */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-foreground">Project Summary</h3>
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground font-normal">
                  {p.summary}
                </p>
                <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
                  <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]" />
                </div>
              </div>

              {/* Scope Checklist */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="text-base font-bold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-3">
                    Scope of Work
                  </h3>
                  <ul className="space-y-4">
                    {p.scope.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-sm md:text-base text-foreground leading-snug">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Photos Content */}
          <TabsContent value="gallery">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {p.gallery.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`${p.title} — Image ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm text-white transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 className="h-5 w-5" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          {/* Videos Content */}
          {p.videos && p.videos.length > 0 && (
            <TabsContent value="videos">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {p.videos.map((vid, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-[16/9] bg-secondary flex items-center justify-center overflow-hidden">
                      {vid.thumbnail ? (
                        <img src={vid.thumbnail} alt={vid.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/10 flex items-center justify-center">
                          <Video className="h-10 w-10 text-accent/40" />
                        </div>
                      )}
                      
                      {/* Play overlay button */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveVideoUrl(vid.url);
                          setActiveVideoTitle(vid.title);
                        }}
                        className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors cursor-pointer"
                        aria-label={`Play ${vid.title}`}
                      >
                        <div className="rounded-full bg-accent/90 p-4 text-white shadow-lg transform transition-transform group-hover:scale-110 duration-300">
                          <Play className="h-6 w-6 fill-current ml-0.5" />
                        </div>
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                        {vid.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">Video Presentation</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </section>

      {/* Lightbox Dialog (Radix UI) */}
      <Dialog open={activeImageIndex !== null} onOpenChange={(open) => !open && setActiveImageIndex(null)}>
        <DialogContent className="max-w-4xl p-1 bg-black/95 border-none shadow-2xl flex flex-col items-center justify-center focus-visible:outline-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Project Gallery Lightbox</DialogTitle>
            <DialogDescription>Viewing project images fullscreen</DialogDescription>
          </DialogHeader>

          {activeImageIndex !== null && (
            <div className="relative w-full h-[80vh] flex items-center justify-center select-none">
              {/* Main Image */}
              <img
                src={p.gallery[activeImageIndex]}
                alt={`${p.title} fullscreen — ${activeImageIndex + 1}`}
                className="max-h-[75vh] max-w-full rounded-lg object-contain"
              />

              {/* Navigation Controls */}
              {p.gallery.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/90 hover:scale-105 cursor-pointer z-20 border border-white/10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/90 hover:scale-105 cursor-pointer z-20 border border-white/10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Bottom Metadata Info */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-xs text-white backdrop-blur-sm border border-white/10">
                Image {activeImageIndex + 1} of {p.gallery.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Modal Player Dialog */}
      <Dialog 
        open={activeVideoUrl !== null} 
        onOpenChange={(open) => {
          if (!open) {
            setActiveVideoUrl(null);
            setActiveVideoTitle(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl p-2 bg-black border-none shadow-2xl focus-visible:outline-none">
          <DialogHeader className="sr-only">
            <DialogTitle>{activeVideoTitle || "Project Video Player"}</DialogTitle>
            <DialogDescription>Playing project video preview</DialogDescription>
          </DialogHeader>

          {activeVideoUrl && (
            <div className="relative w-full aspect-[16/9] flex items-center justify-center bg-black rounded-lg overflow-hidden">
              <video
                src={activeVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          {activeVideoTitle && (
            <div className="px-4 py-3 bg-neutral-900 rounded-b-lg">
              <h3 className="font-bold text-sm text-white">{activeVideoTitle}</h3>
              <p className="text-xs text-neutral-400 mt-1">{p.title} · Project Media</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}