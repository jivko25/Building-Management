import EditProject from "@/components/Forms/Projects/ProjectFormEdit/EditProject";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/types/project-types/projectTypes";

type ProjectsCardProps = {
  projects: Project[];
};

const ProjectsCard = ({ projects }: ProjectsCardProps) => {
  console.log("🎴 Projects in ProjectsCard:", projects);

  return (
    <>
      {projects &&
        projects.map((project) => (
          <Card className="w-[21rem]" key={project.id}>
            <CardHeader className="bg-header rounded-t-lg">
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <CardDescription>
                <span className="font-semibold pr-1">Start date:</span>
                <span>
                  {new Date(project.start_date!)
                    .toLocaleDateString()
                    .slice(0, 10)}
                </span>
              </CardDescription>
              <CardDescription>
                <span className="font-semibold pr-1">End date:</span>
                <span>
                  {project.end_date
                    ? new Date(project.end_date)
                        .toLocaleDateString()
                        .slice(0, 10)
                    : "Not set"}
                </span>
              </CardDescription>
              <CardDescription>
                <span className="font-semibold pr-1">Status:</span>
                <span>{project.status}</span>
              </CardDescription>
              <CardDescription>
                <span className="font-semibold pr-1">Company:</span>
                <span>{project.company?.name}</span>
              </CardDescription>
            </CardContent>
            <CardFooter className="p-1 justify-center items-center rounded-b-lg border-t">
              <EditProject projectId={project.id!.toString()} />
            </CardFooter>
          </Card>
        ))}
    </>
  );
};

export default ProjectsCard;
