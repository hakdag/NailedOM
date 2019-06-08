cd aspnetcore-server
chmod 777 build.sh
sudo ./build.sh
sudo dotnet run -p src/IO.Swagger/IO.Swagger.csproj --launch-profile web
