import { useAuth } from "@/providers/AuthProvider";
import { Login } from "@/screens/auth/login";
import Register from "@/screens/auth/register";
import Benefits from "@/screens/screensAdmin/Benefits";
import CompaniesList from "@/screens/screensAdmin/CompaniesList";
import CompanyForm from "@/screens/screensAdmin/CompaniesList/CompanyForm";
import PositionsList from "@/screens/screensAdmin/Positions";
import TagsList from "@/screens/screensAdmin/Tags";
import CandidateOpportunities from "@/screens/screensCandidate/CandidateOpportunities";
import ResumeEdit from "@/screens/screensCandidate/EditResume";
import CandidateHome from "@/screens/screensCandidate/Home";
import OpportunitieFeedbacks from "@/screens/screensCandidate/OpportunitieFeedbacks";
import OpportunitiesList from "@/screens/screensCandidate/Opportunities";
import OpportunitiesView from "@/screens/screensCandidate/OpportunitiesView";
import CandidateProfile from "@/screens/screensCandidate/Profile";
import Resume from "@/screens/screensCandidate/Resume";
import VideoResume from "@/screens/screensCandidate/VideoResume";
import CompanyDashboard from "@/screens/screensCompany/Dashboard";
import CandidatesList from "@/screens/screensCompany/ListCandidates";
import CompanyProfile from "@/screens/screensCompany/Profile";
import { SelectionProcessDetails } from "@/screens/screensCompany/SelectionProcessDetails";
import SelectiveProcesses from "@/screens/screensCompany/SelectiveProcess";
import { SelectionProcessForm } from "@/screens/screensCompany/SelectiveProcess/SelectionProcessForm";
import NotFound404 from "@/screens/screensPublic/404/404";

import { Documentation } from "@/screens/screensPublic/documentation";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

const Routes = () => {
    const { token } = useAuth();

    /*====| Rotas para todos os usuarios |====*/

    const routesForPublic = [
        {
            path: "/documentacao",
            element: <Documentation />
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/cadastro",
            element: <Register />
        },
        {
            path: "*",
            element: <NotFound404 />
        },


    ]


    /*====| Rotas para usuarios autenticados |====*/
    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <ProtectedRoute />,
            children: [
                //ROTAS DO CANDIDATO 
                {
                    path: "candidato/home",
                    element: <CandidateHome />
                },
                {
                    path: "empresa/dashboard",
                    element: <CompanyDashboard />
                },
                {
                    path: "candidato/curriculo",
                    element: <Resume />
                },
                {
                    path: "candidato/video-curriculo",
                    element: <VideoResume />
                },
                {
                    path: "candidato/ver-vagas",
                    element: <OpportunitiesList />
                },
                {
                    path: "candidato/ver-vagas/visualizar-vaga/:id",
                    element: <OpportunitiesView />
                },
                {
                    path: "candidato/minhas-vagas",
                    element: <CandidateOpportunities />
                },
                {
                    path: "candidato/processo-seletivo/:id/feedback",
                    element: <OpportunitieFeedbacks />
                },
                {
                    path: "candidato/editar-curriculo",
                    element: <ResumeEdit />
                },
                {
                    path: "candidato/perfil",
                    element: <CandidateProfile />
                },

                //ROTAS DA ADMIN
                {
                    path: "admin/empresas",
                    element: <CompaniesList />
                },
                {
                    path: "admin/empresas/nova",
                    element: <CompanyForm />
                },
                {
                    path: "admin/beneficios",
                    element: <Benefits />
                },
                {
                    path: "admin/cargos",
                    element: <PositionsList />
                },
                {
                    path: "admin/tags",
                    element: <TagsList />
                },
                //ROTAS DA EMPRESA
                {
                    path: "empresa/candidatos",
                    element: <CandidatesList />
                },
                {
                    path: "curriculo/:id",
                    element: <Resume />
                },
                {
                    path: "empresa/processos-seletivos/",
                    element: <SelectiveProcesses />
                },
                {
                    path: "empresa/processo-seletivo/detalhes/:id",
                    element: <SelectionProcessDetails />
                },
                {
                    path: "empresa/processo-seletivo/novo",
                    element: <SelectionProcessForm />
                },
                {
                    path: "empresa/perfil",
                    element: <CompanyProfile />
                }
            ]
        }
    ]

    /*====| Rotas para usuarios não autenticados |====*/
    const routesForNotAuthenticatedOnly = [
        {
            path: "/",
            element: <Login />,
        },
        {
            path: "/criar-conta",
            element: <Register />,
        },
        {
            path: "*",
            element: <NotFound404 />,
        },
    ];

    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!token ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
    ]);

    return <RouterProvider router={router} />;
}

export default Routes;