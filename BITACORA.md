### Fase 1: Configuración inicial y primer bloqueo

* **Datos:** (25 minutos, 1 prompt inicial extenso). El equipo se consolidó de la siguiente manera: Santiago Suarez asumió el rol de Piloto para interactuar directamente con el código, Cesar Borray como Tester para verificar la calidad, Nicolas Toro como Escriba documentando el avance, y Christian Duarte como Arquitecto diseñando la estructura. Seleccionamos Replit como nuestro entorno de desarrollo colaborativo por su agilidad.

* **Qué hicimos y qué decidió la IA:** Definimos el alcance y le enviamos un prompt inicial detallado a la IA para que construyera la primera versión del proyecto desde cero. La IA estructuró la arquitectura base y generó el código, el cual subimos de inmediato al repositorio para su revisión. Nuestro Tester validó la funcionalidad completa de esta versión, lo que nos llevó a aprobar con confianza la integración del proyecto.

* **Qué nos sorprendió o salió mal:** Nos sorprendió gratamente la velocidad y precisión con la que la IA logró levantar una versión inicial funcional y coherente. Sin embargo, el revés ocurrió en el control de versiones: al intentar realizar el Pull Request (PR) para integrar nuestra rama, el sistema arrojó conflictos de código que bloquearon por completo la posibilidad de hacer el merge automático.

* **Qué haríamos distinto:** Para prevenir esto, estableceríamos una estrategia de sincronización de ramas mucho más estricta. Haríamos un `git pull` o revisión del estado de la rama principal antes de empezar a inyectar y aprobar todo el código generado por la IA, asegurándonos de tener siempre el historial más reciente.

### Fase 2: Resolución de conflictos e integración de entornos

* **Datos:** (Aprox. 15-20 minutos, 3-4 prompts enfocados en depuración, dependencias y configuración). Seguimos trabajando sobre Replit, pero esta vez con un enfoque más analítico, utilizando la IA como herramienta de consulta para entender los logs de errores y solucionar los problemas de compatibilidad en la ejecución.

* **Qué hicimos y qué decidió la IA:** Nos vimos obligados a revisar manualmente los conflictos en el código, comparando meticulosamente las diferencias entre las ramas para resolverlos. Tras esto, descargamos las dependencias necesarias y corrimos las pruebas. La IA nos asistió sugiriendo ajustes en la configuración de los puertos y en los scripts de inicio para lograr conectar los dos entornos de la aplicación.

* **Qué nos sorprendió o salió mal:** Fue frustrante descubrir que, a pesar de haber resuelto los conflictos del merge exitosamente, el proyecto solo lograba correr de manera parcial. Mientras que el backend parecía estable, el entorno nos impedía ejecutar el frontend. Tuvimos que lidiar con errores de compatibilidad inesperados entre la lógica del servidor y la interfaz antes de finalmente lograr que ambos se comunicaran.

* **Qué haríamos distinto:** En lugar de intentar correr el proyecto completo tras un merge complejo, adoptaríamos una metodología de prueba aislada. Levantaríamos y probaríamos el backend de forma independiente y, solo tras confirmar su estabilidad, procederíamos a ejecutar el frontend, pidiéndole a la IA scripts de validación específicos para cada capa.

### Fase 3: Integración de proyecto externo y nueva funcionalidad

* **Datos:** (Aprox. 20-30 minutos, 2-3 prompts enfocados en manipulación de datos y exportación). Continuamos con los mismos roles, pero operando sobre un código base distinto tras realizar un fork del repositorio perteneciente al Grupo D. 

* **Qué hicimos y qué decidió la IA:** Como primer paso, nuestro Tester realizó pruebas de regresión exhaustivas sobre el fork para garantizar que el proyecto base funcionara en orden. Una vez estabilizado, solicitamos a la IA la implementación de una característica nueva: un filtro para visualizar las visitas de los últimos 30 días y la capacidad de exportar esa información en un archivo CSV que incluyera exactamente los campos de mascota, responsable, fecha y motivo. La IA generó la lógica de filtrado de fechas y el formateo del CSV. Finalmente, validamos tanto las funciones antiguas como las nuevas, y subimos esta versión final al repositorio confirmando el éxito de la integración.

* **Qué nos sorprendió o salió mal:** A diferencia de la fricción experimentada en las fases previas, nos sorprendió muy positivamente la fluidez con la que la IA logró inyectar código nuevo dentro de una arquitectura ajena (la del Grupo D) sin romper el ecosistema. La generación del archivo CSV y el cálculo del filtro de 30 días funcionaron de forma impecable desde el primer intento.

* **Qué haríamos distinto:** Dado que las pruebas en esta fase fueron manuales, para un futuro desarrollo de este tipo le pediríamos a la IA que, junto con la funcionalidad del CSV, redactara scripts de pruebas unitarias automatizadas (por ejemplo, para comprobar que el archivo exportado contenga las columnas correctas y que el filtro de días sea exacto) antes de empujar el código a la rama final.