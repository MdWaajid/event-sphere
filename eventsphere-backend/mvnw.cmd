@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET DP0=%~dp0
@SET MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%
@IF NOT "%MAVEN_PROJECTBASEDIR%"=="" GOTO done_find_basedir

:find_basedir
@SET EXEC_DIR=%CD%
@SET WRK_DIR=%CD%
:find_basedir_loop
@IF EXIST "%WRK_DIR%"\.mvn GOTO done_find_basedir
@CD ..
@IF "%WRK_DIR%"=="%CD%" GOTO basedir_not_found
@SET WRK_DIR=%CD%
@GOTO find_basedir_loop

:done_find_basedir
@SET MAVEN_PROJECTBASEDIR=%WRK_DIR%
@CD "%EXEC_DIR%"
@GOTO continue

:basedir_not_found
@SET MAVEN_PROJECTBASEDIR=%EXEC_DIR%
@CD "%EXEC_DIR%"

:continue
@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
@SET WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"

@SET DOWNLOAD_URL=%WRAPPER_URL%

@IF EXIST %WRAPPER_JAR% (
    @SET MVNW_VERBOSE=false
    @IF NOT "%MVNW_VERBOSE%"=="" (
        @echo Found %WRAPPER_JAR%
    )
) ELSE (
    @echo Downloading from: %DOWNLOAD_URL%
    @powershell -Command "&{"^
        "$webclient = new-object System.Net.WebClient;"^
        "if (-not ([string]::IsNullOrEmpty('%MVNW_USERNAME%') -and [string]::IsNullOrEmpty('%MVNW_PASSWORD%'))) {"^
        "  $webclient.Credentials = new-object System.Net.NetworkCredential('%MVNW_USERNAME%', '%MVNW_PASSWORD%');"^
        "}"^
        "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $webclient.DownloadFile('%DOWNLOAD_URL%', '%WRAPPER_JAR%')"^
        "}"
    @IF "%ERRORLEVEL%"=="0" (@echo Downloaded successfully)
    @IF NOT "%ERRORLEVEL%"=="0" (@echo Download failed)
)

@SET JAVA_EXE=%JAVA_HOME%/bin/java.exe
@IF NOT EXIST "%JAVA_EXE%" SET JAVA_EXE=java

%JAVA_EXE% ^
  "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
  %MAVEN_CONFIG% ^
  %WRAPPER_LAUNCHER% %MAVEN_CONFIG% %*
