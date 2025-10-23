const Header = ({ athlete, workout }: { athlete: string; workout: string }) => {
    return (
        <div>
            <p className="text-lg font-semi-bold p-4">
                {athlete} - {workout}
            </p>
        </div>
    );
};
export default Header;
