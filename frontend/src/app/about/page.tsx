import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { profileConfig } from "@/config/profile";
import { Code, Coffee, Github, Lightbulb, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const interests = [
    { icon: Code, title: profileConfig.interests[0].title, description: profileConfig.interests[0].description },
    { icon: Coffee, title: profileConfig.interests[1].title, description: profileConfig.interests[1].description },
    { icon: Lightbulb, title: profileConfig.interests[2].title, description: profileConfig.interests[2].description },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* En-tête */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">À propos de moi</h1>
        <p className="text-muted-foreground text-lg">
          Développeur passionné et amateur de nouveautés
        </p>
      </div>

      {/* Section principale */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {/* Photo et informations */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden border-4 border-primary/10">
            <Image
              src={profileConfig.avatar}
              alt={profileConfig.name}
              width={192}
              height={192}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">{profileConfig.name}</h2>
          <p className="text-muted-foreground mb-4">{profileConfig.title}</p>
          
          {/* Liens sociaux */}
          <div className="flex gap-2 mb-6">
            <Button variant="outline" size="icon" asChild>
              <a href={profileConfig.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href={profileConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href={profileConfig.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </Button>
          </div>

          <Button asChild className="w-full">
            <Link href="/contact">
              <Mail className="w-4 h-4 mr-2" />
              Me contacter
            </Link>
          </Button>
        </div>

        {/* Biographie */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bonjour ! 👋</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>{profileConfig.bio.intro}</p>
              <p>{profileConfig.bio.journey}</p>
              <p>{profileConfig.bio.personal}</p>
            </CardContent>
          </Card>

          {/* Compétences */}
          <Card>
            <CardHeader>
              <CardTitle>Mes compétences</CardTitle>
              <CardDescription>
                Les technologies avec lesquelles j&apos;aime travailler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profileConfig.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="mb-16" />

      {/* Ce qui me passionne */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Ce qui me passionne</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {interests.map((interest) => (
            <Card key={interest.title}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <interest.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{interest.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{interest.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pourquoi ce blog */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pourquoi ce blog ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            J&apos;ai créé ce blog pour plusieurs raisons :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Partager mes connaissances et aider d&apos;autres développeurs</li>
            <li>Documenter mon parcours d&apos;apprentissage</li>
            <li>Créer une communauté autour des technologies que j&apos;aime</li>
            <li>Améliorer mes compétences en écriture et en communication</li>
          </ul>
          <p>
            Si vous avez des questions, des suggestions ou juste envie de discuter, 
            n&apos;hésitez surtout pas à me contacter !
          </p>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/blog">
            Découvrir mes articles
          </Link>
        </Button>
      </div>
    </div>
  );
}
