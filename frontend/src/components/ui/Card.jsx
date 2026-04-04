import { theme } from "../../styles/theme";

export default function Card({ children }) {

    return (

        <div style={{

            background: theme.colors.card,

            border: `1px solid ${theme.colors.border}`,

            borderRadius: theme.radius.lg,

            padding: theme.spacing.card

        }}>

            {children}

        </div>

    );

}