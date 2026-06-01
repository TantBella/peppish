FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["API_Peppish.csproj", "."]
RUN dotnet restore "API_Peppish.csproj"
COPY . .
RUN dotnet build "API_Peppish.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "API_Peppish.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "api_peppish.dll"]
