echo "Updating global npm..."
npm install -g npm
echo "Updating global angular cli (ng)..."
npm install -g  @angular/cli@latest
echo "Updating project angular cli (ng)..."
npm install @angular/cli@latest
echo "Install project dependencies"
npm install
echo "Tour of Bonds is ready. To run use \"ng serve\". See README.md for more details."
