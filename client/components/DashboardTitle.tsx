/**
 * DashboardTitle component
 *
 * @param {{ title: string }} props - component props
 * @prop {string} title - title to display
 *
 * @returns {JSX.Element} - component element
 */
export default function DashboardTitle({ title }: { title: string }) {
    return (
        <h1 className="text-2xl font-bold mb-4">
            {/* display title */}
            {title}
        </h1>
    );
}