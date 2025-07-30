import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Factory, Cog, Zap, Target, User } from "lucide-react";
import manufacturingImage from "@/assets/manufacturing.jpg";
import directorPhoto from "@/assets/director-photo.jpeg";

const AboutSection = () => {
  const values = [
    {
      icon: Factory,
      title: "In-House Excellence",
      description: "Complete control over design, machining, and assembly ensures uncompromising quality."
    },
    {
      icon: Cog,
      title: "Precision Engineering",
      description: "24+ years of CNC machining expertise delivers exceptional precision and durability."
    },
    {
      icon: Zap,
      title: "Smart Innovation",
      description: "Integration of cutting-edge automation and smart technologies for energy efficiency."
    },
    {
      icon: Target,
      title: "Bespoke Solutions",
      description: "Every project is uniquely tailored to meet specific requirements and design visions."
    }
  ];

  return (
    <section id="about" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">About Celestial Lights</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Illuminating Excellence Since 
            <span className="text-primary"> 1999</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A proud subsidiary of Siddhivinayak Engineering, we combine decades of precision manufacturing 
            expertise with innovative lighting design to create extraordinary illumination solutions.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold mb-6">Our Heritage & Mission</h3>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Born from Siddhivinayak Engineering's rich legacy in precision CNC machining, 
                Celestial Lights represents the evolution of manufacturing excellence into the 
                world of architectural illumination.
              </p>
              <p className="text-lg text-muted-foreground">
                Our mission is simple yet profound: to transform spaces through the artful 
                application of light. We believe that exceptional lighting doesn't just illuminate—it 
                inspires, energizes, and creates experiences that resonate with the human spirit.
              </p>
              <p className="text-lg text-muted-foreground">
                With complete in-house capabilities spanning from initial concept to final installation, 
                we offer unparalleled customization and quality control that sets us apart in the industry.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={manufacturingImage} 
              alt="CNC machining precision manufacturing"
              className="rounded-2xl shadow-elegant w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* Director Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Leadership</Badge>
            <h3 className="text-3xl font-bold mb-6">Meet Our Director</h3>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 bg-background/50 overflow-hidden">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <div className="relative w-48 h-48 mx-auto md:mx-0 mb-6">
                      <img 
                        src={directorPhoto} 
                        alt="Director portrait"
                        className="w-full h-full object-cover rounded-2xl shadow-elegant"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent rounded-2xl"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold">Atharv Chaudhari</h4>
                        <p className="text-muted-foreground">Director</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        Our 24-year-old director brings a fresh perspective from the IT field to the lighting industry. 
                        With a strong background in technology, he leads Celestial Lights with innovative approaches 
                        and cutting-edge digital integration, revolutionizing traditional lighting solutions through 
                        modern technological advancements and forward-thinking strategies.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="border-0 bg-background/50 hover:bg-background transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-3">{value.title}</h4>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vision Statement */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-hero rounded-3xl p-12 border border-primary/20">
            <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              "To be the global leader in bespoke lighting solutions, where every project showcases 
              the perfect marriage of traditional craftsmanship with cutting-edge technology, 
              creating illumination that transcends the ordinary."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;