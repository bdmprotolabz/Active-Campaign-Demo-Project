# Step 1: Build the ActiveCampaignAPIWrapper
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Copy ActiveCampaignAPIWrapper project and restore dependencies
COPY ./ActiveCampaignAPIWrapper/ActiveCampaignAPIWrapper.csproj .  # Corrected
RUN dotnet restore ActiveCampaignAPIWrapper.csproj

# Copy the rest of the project files and build the DLL
COPY ./ActiveCampaignAPIWrapper/. .  # Corrected
RUN dotnet build ActiveCampaignAPIWrapper.csproj -c Release -o /out

# Step 2: Build the Test project
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

WORKDIR /app

# Copy the Test project csproj file and restore dependencies
COPY ./WrapperTestProject/ActiveCampaignWrapperTest/ActiveCampaignWrapperTest.csproj .  # Corrected
RUN dotnet restore ActiveCampaignWrapperTest.csproj

# Copy the rest of the Test project files and build
COPY ./WrapperTestProject/ActiveCampaignWrapperTest/. .  # Corrected
RUN dotnet build ActiveCampaignWrapperTest.csproj -c Release

# Step 3: Publish the Test project
RUN dotnet publish ./WrapperTestProject/ActiveCampaignWrapperTest/ActiveCampaignWrapperTest.csproj -c Release -o /app/publish

# Step 4: Set up runtime environment
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app
COPY --from=base /app/publish . 
ENTRYPOINT ["dotnet", "ActiveCampaignWrapperTest.dll"]
