import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

/**
 * RunRecipe - A reusable component for rendering OpenRewrite recipe running instructions.
 *
 * @param {Object} props
 * @param {string} props.recipeName - The fully qualified recipe name (e.g., "org.openrewrite.java.testing.assertj.Assertj")
 * @param {string} props.recipeDisplayName - Human-readable name for IntelliJ tab (e.g., "Adopt AssertJ")
 * @param {string} props.artifact - The Maven artifact coordinates (e.g., "org.openrewrite.recipe:rewrite-testing-frameworks")
 * @param {string} [props.intellijWrapperName] - Optional custom wrapper name for rewrite.yml (defaults to derived from recipeDisplayName)
 * @param {string} [props.intellijDescription] - Optional description for the IntelliJ rewrite.yml
 * @param {boolean} [props.requiresYamlInstall=false] - Whether the recipe requires `mod config recipes yaml install`
 */
export default function RunRecipe({
  recipeName,
  recipeDisplayName,
  artifact,
  intellijWrapperName,
  intellijDescription,
  requiresYamlInstall = false,
}) {
  // Derive the IntelliJ wrapper name from the display name if not provided
  const wrapperName = intellijWrapperName || `com.github.timtebeek.${recipeDisplayName.replace(/\s+/g, '')}`;
  const description = intellijDescription || `${recipeDisplayName} and apply best practices to assertions.`;

  // Extract groupId and artifactId from the artifact coordinates
  const [groupId, artifactId] = artifact.split(':');

  // Moderne CLI code snippets
  const modBuild = `mod build ~/workspace/`;

  const modConfigRecipes = requiresYamlInstall
    ? `mod config recipes jar install ${artifact}:LATEST
mod config recipes yaml install /path/to/your/rewrite.yml`
    : `mod config recipes jar install ${artifact}:LATEST`;

  const modRun = `mod run ~/workspace/ --recipe ${recipeName}`;

  // Maven CLI
  const mavenCli = `mvn -U org.openrewrite.maven:rewrite-maven-plugin:run -Drewrite.recipeArtifactCoordinates=${artifact}:RELEASE -Drewrite.activeRecipes=${recipeName} -Drewrite.exportDatatables=true`;

  // Maven POM
  const mavenPom = `<project>
  <build>
    <plugins>
      <plugin>
        <groupId>org.openrewrite.maven</groupId>
        <artifactId>rewrite-maven-plugin</artifactId>
        <version>LATEST</version>
        <configuration>
          <exportDatatables>true</exportDatatables>
          <activeRecipes>
            <recipe>${recipeName}</recipe>
          </activeRecipes>
        </configuration>
        <dependencies>
          <dependency>
            <groupId>${groupId}</groupId>
            <artifactId>${artifactId}</artifactId>
            <version>LATEST</version>
          </dependency>
        </dependencies>
      </plugin>
    </plugins>
  </build>
</project>`;

  // Gradle init script
  const gradleInit = `initscript {
    repositories {
        maven { url "https://plugins.gradle.org/m2" }
    }
    dependencies { classpath("org.openrewrite:plugin:latest.release") }
}
rootProject {
    plugins.apply(org.openrewrite.gradle.RewritePlugin)
    dependencies {
        rewrite("${artifact}:latest.release")
    }
    rewrite {
        activeRecipe("${recipeName}")
        setExportDatatables(true)
    }
    afterEvaluate {
        if (repositories.isEmpty()) {
            repositories {
                mavenCentral()
            }
        }
    }
}`;

  // Gradle build file
  const gradleBuild = `plugins {
    id("org.openrewrite.rewrite") version("latest.release")
}

rewrite {
    activeRecipe("${recipeName}")
    setExportDatatables(true)
}

repositories {
    mavenCentral()
}

dependencies {
    rewrite("${artifact}:latest.release")
}`;

  // IntelliJ rewrite.yml
  const intellijYaml = `---
type: specs.openrewrite.org/v1beta/recipe
name: ${wrapperName}
displayName: ${recipeDisplayName}
description: ${description}
recipeList:
  - ${recipeName}`;

  return (
    <Tabs groupId="projectType">
      <TabItem value="moderne-cli" label="Moderne CLI">
        <p>
          The Moderne CLI allows you to run OpenRewrite recipes on your project without needing to modify your build files,
          against serialized Lossless Semantic Tree (LST) of your project for a considerable performance boost &amp; across projects.
        </p>
        <p>
          You will need to have configured the{' '}
          <a href="https://docs.moderne.io/user-documentation/moderne-cli/getting-started/cli-intro">Moderne CLI</a>{' '}
          on your machine before you can run the following command.
        </p>
        <ol>
          <li>
            If project serialized Lossless Semantic Tree is not yet available locally, then build the LST.
            This is only needed the first time, or after extensive changes:
            <CodeBlock language="bash" title="shell">
              {modBuild}
            </CodeBlock>
          </li>
          <li>
            If the recipe is not available locally yet, then you can install it once using:
            <CodeBlock language="shell" title="shell">
              {modConfigRecipes}
            </CodeBlock>
          </li>
          <li>
            Run the recipe.
            <CodeBlock language="shell" title="shell">
              {modRun}
            </CodeBlock>
          </li>
        </ol>
      </TabItem>
      <TabItem value="maven-command-line" label="Maven Command Line">
        <p>
          You will need to have <a href="https://maven.apache.org/download.cgi">Maven</a> installed on your machine before you can run the following command.
        </p>
        <CodeBlock language="shell" title="shell">
          {mavenCli}
        </CodeBlock>
      </TabItem>
      <TabItem value="maven" label="Maven POM">
        <p>You may add the plugin to your <code>pom.xml</code> file, so that it is available for all developers and CI/CD pipelines.</p>
        <ol>
          <li>
            Add the following to your <code>pom.xml</code> file:
            <CodeBlock language="xml" title="pom.xml">
              {mavenPom}
            </CodeBlock>
          </li>
          <li>
            Run the recipe.
            <CodeBlock language="shell" title="shell">
              mvn rewrite:run
            </CodeBlock>
          </li>
        </ol>
      </TabItem>
      <TabItem value="gradle-init-script" label="Gradle init script">
        <p>Gradle init scripts are a good way to try out a recipe without modifying your <code>build.gradle</code> file.</p>
        <ol>
          <li>
            Create a file named <code>init.gradle</code> in the root of your project.
            <CodeBlock language="groovy" title="init.gradle">
              {gradleInit}
            </CodeBlock>
          </li>
          <li>
            Run the recipe.
            <CodeBlock language="shell" title="shell">
              gradle --init-script init.gradle rewriteRun
            </CodeBlock>
          </li>
        </ol>
      </TabItem>
      <TabItem value="gradle" label="Gradle">
        <p>You can add the plugin to your <code>build.gradle</code> file, so that it is available for all developers and CI/CD pipelines.</p>
        <ol>
          <li>
            Add the following to your <code>build.gradle</code> file:
            <CodeBlock language="groovy" title="build.gradle">
              {gradleBuild}
            </CodeBlock>
          </li>
          <li>Run <code>gradle rewriteRun</code> to run the recipe.</li>
        </ol>
      </TabItem>
      <TabItem value="intelliJ" label="IntelliJ IDEA Ultimate">
        {requiresYamlInstall ? (
          <>
              <p>You can run OpenRewrite recipes directly from IntelliJ IDEA, after <a href="https://plugins.jetbrains.com/plugin/23814-openrewrite">installing the OpenRewrite plugin</a>.</p>
            <p>After adding the <code>rewrite.yml</code> file shown above to your project, you should see a run icon in the left margin offering to run the recipe.</p>
          </>
        ) : (
          <>
            <p>You can run OpenRewrite recipes directly from IntelliJ IDEA Ultimate, after <a href="https://plugins.jetbrains.com/plugin/23814-openrewrite">installing the OpenRewrite plugin</a>, by adding a <code>rewrite.yml</code> file to your project.</p>
            <CodeBlock language="yaml" title="rewrite.yml">
              {intellijYaml}
            </CodeBlock>
            <p>After adding the file, you should see a run icon in the left margin offering to run the recipe.</p>
          </>
        )}
      </TabItem>
    </Tabs>
  );
}
