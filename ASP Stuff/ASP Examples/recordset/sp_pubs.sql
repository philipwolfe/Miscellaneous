if exists (select * from sysobjects where id = object_id(N'[dbo].[sp_pubs]') and OBJECTPROPERTY(id, N'IsProcedure') = 1)
drop procedure [dbo].[sp_pubs]
GO

SET QUOTED_IDENTIFIER  OFF    SET ANSI_NULLS  ON 
GO

CREATE PROCEDURE sp_pubs AS
BEGIN
SELECT * FROM authors
SELECT * FROM titles
END
GO
SET QUOTED_IDENTIFIER  OFF    SET ANSI_NULLS  ON 
GO

