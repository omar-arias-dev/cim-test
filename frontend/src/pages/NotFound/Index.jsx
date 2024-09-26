import { useNavigate } from "react-router-dom";
import { CalloutCard } from '@shopify/polaris';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="p-5">
      <CalloutCard
        title="404 NOT FOUND"
        illustration="https://play-lh.googleusercontent.com/iiIJq5JmLFYNI1bVz4IBHyoXs508JcEzHhOgau69bnveF9Wat51-ax9LMPVOlneKwqg"
        primaryAction={{
          content: 'Ir a Login',
          onAction: () => navigate("/"),
        }}
      >
        <p>La ruta que estás intentando buscar no existe.</p>
      </CalloutCard>
    </div>
  )
}